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
import { catchError, map, take } from 'rxjs/operators';
import { Promo } from '../../resources/models/promo';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

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
  isEditing = false;

  constructor(
    public utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private promoService: PromoService,
    private httpClient: HttpClient,
    private usersService: UsersService,
    private router: Router,
    private geolocation: Geolocation,
    private camera: Camera
  ) {
    this.initForm();

    this.apiLoaded = this.httpClient.
      jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDYYmgUbVdVVKIn6QSNCsAql4deOw766KM&libraries=places', 'callback')
      .pipe(
        take(1),
        map(() => true),
        catchError(() => of(false))
      );

    this.apiLoaded.subscribe(() => this.getUserLocation());
  }

  ngOnInit(): void {
    /* const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    }); */

    this.uid = this.activatedRoute.snapshot.paramMap.get('uid');

    if (!this.uid) {
      this.toggleIsEditing(true);
      return;
    }

    this.promoService.getByUid(this.uid)
      .pipe(
        take(1)
      ).subscribe(res => {
        this.promo = { ...res };

        this.form.patchValue(this.promo);
      });
  }

  initForm() {
    this.form = new FormGroup({
      uid: new FormControl({ value: this.promo?.uid, disabled: true }),
      store: new FormControl({ value: this.promo?.store, disabled: !this.isEditing }, [Validators.required]),
      product: new FormControl({ value: this.promo?.product, disabled: !this.isEditing }, [Validators.required]),
      price: new FormControl({ value: this.promo?.price, disabled: !this.isEditing }, [Validators.required]),
      createdAt: new FormControl({ value: this.promo?.createdAt, disabled: true }),
      address: new FormControl({ value: this.promo?.address, disabled: !this.isEditing }, [Validators.required]),
      observation: new FormControl({ value: this.promo?.observation || '', disabled: !this.isEditing }),
      createdBy: new FormControl({ value: this.promo?.createdBy, disabled: true }),
      likes: new FormControl({ value: this.promo?.likes || 0, disabled: true }),
    });
  }

  getUserLocation(): void {
    this.initializeAutocomplete(this.defaultPos);

    const geolocation = from(this.geolocation.getCurrentPosition());

    geolocation.subscribe({
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

  togglePromoLike(event: Event, promo: Promo): void {
    if (!promo || !promo.uid) {
      return;
    }

    const p = { ...promo };
    p.liked = !p.liked;
    if (p.liked) { p.likes++; }
    else { p.likes--; }

    this.promoService.update(p);
    event.stopPropagation();
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
      const body: Promo = { ...this.form.value };

      this.usersService.currentUserProfile$.pipe(
        take(1)
      ).subscribe(user => {
        body.createdBy = user.displayName;
        body.createdAt = Timestamp.now();
        body.status = PromoStatus.active;

        Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);
        this.promoService.add(body).subscribe(() => {
          this.utilsService.presentSuccessToast();
          this.router.navigate(['promos']);
        });
      });
    } else {
      this.promoService.update(this.form.value).subscribe(() => this.utilsService.presentSuccessToast());
    }
  }

  currentUserLocation(): void {
    const geolocation = from(this.geolocation.getCurrentPosition());

    geolocation.subscribe({
      next: res => this.setAddress(new google.maps.LatLng({ lat: res.coords.latitude, lng: res.coords.longitude })),
      error: err => {
        console.log(err);
        this.utilsService.presentErrorToast('Por favor habilite a localização por GPS!');
      }
    });
  }
}
