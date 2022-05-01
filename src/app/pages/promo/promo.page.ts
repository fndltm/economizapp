import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PromoService } from '@services/promo.service';
import { UtilsService } from '@utils/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Promo } from '../../resources/models/promo';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.page.html',
  styleUrls: ['./promo.page.scss'],
})
export class PromoPage implements OnInit {
  @ViewChild('search')
  public searchElementRef: ElementRef;

  apiLoaded: Observable<boolean>;

  isLoading = false;
  defaultPos: google.maps.LatLngLiteral = { lat: -19.91648963095628, lng: -43.934471644795686 };

  form: FormGroup;
  promo: Promo;
  isEditing = false;

  constructor(
    public utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private promoService: PromoService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.promoService.getByUid(this.activatedRoute.snapshot.paramMap.get('uid'))
      .subscribe(res => {
        this.promo = { ...res };

        this.initForm();

        this.apiLoaded = this.httpClient.
          jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDYYmgUbVdVVKIn6QSNCsAql4deOw766KM&libraries=places', 'callback')
          .pipe(
            map(() => true),
            catchError(() => of(false))
          );

        this.apiLoaded.subscribe(() => this.getUserLocation());
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
      observation: new FormControl({ value: this.promo?.observation || '', disabled: !this.isEditing }, [Validators.required]),
      createdBy: new FormControl({ value: this.promo?.createdBy, disabled: true }),
      likes: new FormControl({ value: this.promo?.likes, disabled: true }),
    });
  }

  getUserLocation(): void {
    this.initializeAutocomplete(this.defaultPos);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.initializeAutocomplete({ lat: position.coords.latitude, lng: position.coords.longitude });
      }, () => {
        this.utilsService.presentErrorToast('Por favor habilite a localização por GPS!');
      }, { enableHighAccuracy: true });
    }
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
    this.isLoading = true;

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

    this.promoService.update(this.form.value).subscribe(() => {
      this.utilsService.presentSuccessToast();
    });
  }

  currentUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);

        const latLng = new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
        console.log(latLng.toJSON());

        this.setAddress(latLng);
      }, () => {
        this.utilsService.presentErrorToast('Por favor habilite a localização por GPS!');
      }, { enableHighAccuracy: true });
    }
  }
}
