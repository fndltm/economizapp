import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoStatus } from '@enums/promo-status';
import { PromoService } from '@services/promo.service';
import { UsersService } from '@services/users.service';
import { UtilsService } from '@utils/utils.service';
import { Timestamp } from 'firebase/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators';
import { Promo } from '../../resources/models/promo';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ImageUploadService } from '@services/image-upload.service';
import { UserProfile } from '@models/user-profile';
import { isPlatform } from '@ionic/angular';
import { Camera as CameraMobile, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Chip, CHIPS } from 'src/app/resources/constants/chip';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.page.html',
  styleUrls: ['./promo.page.scss'],
})
export class PromoPage implements OnInit {
  @ViewChild('search')
  public searchElementRef: ElementRef;

  uid: string;
  apiLoaded: Observable<boolean>;

  defaultPos: google.maps.LatLngLiteral = { lat: -19.91648963095628, lng: -43.934471644795686 };

  form: FormGroup;
  promo: Promo;

  chips = CHIPS;

  isEditing = false;
  canEdit = false;
  user: UserProfile = {} as UserProfile;
  public imagePath = '../../../assets/icons/product.png';
  public base64Image = '';

  constructor(
    public utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private promoService: PromoService,
    private httpClient: HttpClient,
    private usersService: UsersService,
    private router: Router,
    private geolocation: Geolocation,
    private camera: CameraMobile,
    private imageUploadService: ImageUploadService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.usersService.currentUserProfile$.subscribe(user => {
      this.user = { ...user };

      this.uid = this.activatedRoute.snapshot.paramMap.get('uid');
      if (!this.uid) {
        this.canEdit = true;
        this.toggleIsEditing(true);
        return;
      }

      this.promoService.getByUid(this.uid)
        .pipe(
          take(1)
        ).subscribe(res => {
          this.promo = { ...res };

          this.form.patchValue(this.promo);

          if (!this.user) {
            this.canEdit = false;
            return;
          }

          if (!this.promo) {
            this.canEdit = true;
            return;
          }

          this.canEdit = this.user.displayName === this.promo.createdBy;
        });
    });

    if (this.isEditing) {
      this.initMaps();
    }
  }

  initMaps(): void {
    setTimeout(() => {
      if (typeof google === 'object' && typeof google.maps === 'object') {
        this.getUserLocation();
        return;
      }

      this.apiLoaded = this.httpClient.
        jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCvlmFidCQAblRxt1y2feyBxCXBd3yqIaI&libraries=places', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false))
        );

      this.apiLoaded.pipe(
        take(1)
      ).subscribe(() => this.getUserLocation());
    }, 500);
  }

  initForm() {
    this.form = new FormGroup({
      uid: new FormControl({ value: this.promo?.uid, disabled: true }),
      store: new FormControl({ value: this.promo?.store, disabled: !this.isEditing }, [Validators.required]),
      product: new FormControl({ value: this.promo?.product, disabled: !this.isEditing }, [Validators.required]),
      category: new FormControl({ value: this.promo?.category, disabled: !this.isEditing }, [Validators.required]),
      price: new FormControl({ value: this.promo?.price, disabled: !this.isEditing }, [Validators.required]),
      createdAt: new FormControl({ value: this.promo?.createdAt, disabled: true }),
      address: new FormControl({ value: this.promo?.address, disabled: !this.isEditing }, [Validators.required]),
      observation: new FormControl({ value: this.promo?.observation || '', disabled: !this.isEditing }),
      createdBy: new FormControl({ value: this.promo?.createdBy, disabled: true }),
      photo: new FormControl({ value: this.promo?.photo || '', disabled: true }),
    });
  }

  getUserLocation(): void {
    this.initializeAutocomplete(this.defaultPos);

    const geolocation = from(this.geolocation.getCurrentPosition());

    geolocation.pipe(
      take(1)
    ).subscribe({
      next: res => this.initializeAutocomplete({ lat: res.coords.latitude, lng: res.coords.longitude }),
      error: err => {
        console.log(err);
        this.utilsService.presentErrorToast('Por favor habilite a localização por GPS!');
      }
    });
  }

  initializeAutocomplete(pos: google.maps.LatLngLiteral): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      componentRestrictions: { country: 'BR' },
      fields: ['address_components', 'geometry', 'icon', 'name'],
      bounds: new google.maps.LatLngBounds(pos),
    });

    autocomplete.addListener('place_changed', () => { this.handlePlaceChanged(autocomplete); });
  }

  toggleIsEditing(editing?: boolean): void {
    if (editing === true) {
      this.isEditing = true;
    }

    if (editing === false) {
      this.isEditing = false;
    }

    if (editing === undefined || editing === null) {
      this.isEditing = !this.isEditing;
    }

    if (this.isEditing) {
      this.form.enable();
      this.initMaps();
    } else {
      this.form.disable();
    }
  }

  handlePlaceChanged = (autocomplete: google.maps.places.Autocomplete) => {
    const location = autocomplete.getPlace().geometry.location;

    this.setAddress(location);
  };

  setAddress(location: google.maps.LatLng): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        this.form.get('address').setValue(results[0]?.formatted_address);
      }
    });
  }

  savePromo(): void {
    this.toggleIsEditing();

    if (this.form.invalid) {
      return;
    }

    if (!this.uid) {
      this.utilsService.setLoading(true);

      const body: Promo = { ...this.form.value };


      body.createdBy = this.user.displayName;
      body.createdAt = Timestamp.now();
      body.status = PromoStatus.active;

      Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

      if (this.base64Image) {
        const photoName = `${this.user.displayName}'s Photo #${body.createdAt.seconds}`;
        from(this.dataUrlToFile(this.base64Image, photoName))
          .pipe(
            take(1)
          ).subscribe(file => {
            this.imageUploadService
              .uploadImage(file, `images/products/${photoName}`)
              .pipe(
                take(1),
                finalize(() => this.utilsService.setLoading(false))
              ).subscribe((photoURL) => {
                body.photo = photoURL;
                this.promoService.add(body).pipe(
                  take(1)
                ).subscribe(() => {
                  this.utilsService.presentSuccessToast();
                  this.router.navigate(['promos']);
                });
              });
          });
      } else {
        this.promoService.add(body).pipe(
          take(1)
        ).subscribe(() => {
          this.utilsService.presentSuccessToast();
          this.router.navigate(['promos']);
        });
      }
    } else {
      if (this.base64Image) {
        const photoName = `${this.form.get('createdBy').value}'s Photo #${this.form.get('createdAt').value.seconds}`;
        this.dataUrlToFile(this.base64Image, photoName).then(file => {

          this.imageUploadService
            .uploadImage(file, `images/products/${photoName}`)
            .pipe(
              take(1),
              switchMap((photoURL) => {
                this.form.get('photo').setValue(photoURL);
                return of(null);
              }),
              finalize(() => this.utilsService.setLoading(false))
            ).subscribe(() => {
              this.promoService.update(this.form.value).subscribe(() => {
                this.utilsService.presentSuccessToast();
                this.router.navigate(['promos']);
              });
            });
        });
      } else {
        this.promoService.update(this.form.value).pipe(
          take(1)
        ).subscribe(() => {
          this.utilsService.presentSuccessToast();
          this.router.navigate(['promos']);
        });
      }
    }
  }

  currentUserLocation(): void {
    const geolocation = from(this.geolocation.getCurrentPosition());

    geolocation.pipe(
      take(1)
    ).subscribe({
      next: res => this.setAddress(new google.maps.LatLng({ lat: res.coords.latitude, lng: res.coords.longitude })),
      error: err => {
        console.log(err);
        this.utilsService.presentErrorToast('Por favor habilite a localização por GPS!');
      }
    });
  }

  capturePhoto(): void {
    if (!isPlatform('capacitor')) {
      this.takePictureWeb();
    } else {
      this.takePictureMobile();
    }
  }

  takePictureWeb = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      width: 720
    });

    this.base64Image = 'data:image/jpeg;base64,' + image.base64String;
  };

  takePictureMobile(): void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 720
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  removePhoto(): void {
    this.base64Image = '';
    this.promo.photo = '';
  }

  async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/jpeg' });
  }

  getImage(): string {
    if (this.base64Image) {
      return this.base64Image;
    } else if (this.promo?.photo) {
      return this.promo.photo;
    } else {
      return this.imagePath;
    }
  }

  compareWithFn = (o1: Chip, o2: Chip) => o1 && o2 ? o1.value === o2.value : o1 === o2;
}
