import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage, private utilsService: UtilsService) { }

  uploadImage(image: File, path: string): Observable<string> {
    this.utilsService.setLoading(true);
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );
  }
}
