import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {IMenuLink} from '../types/MenuLink';
import {ApiSrv} from './providersTokens';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  public favoritesList: BehaviorSubject<IMenuLink[]> = new BehaviorSubject<IMenuLink[]>(null);
  public favoriteLoaded: Subject<void> = new Subject();
  public favoriteLoad: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, @Inject(ApiSrv) public apiService: any) {
  }

  getFavorites = () => {
    this.apiService.getEndpoints(endpoints => this.http.get(endpoints.favorites)
      .pipe(
        catchError((error) => {
          if (error.status !== 204) {
            console.log('error to get favorites, status code: ' + error.status);
          }
          return of([]);
        })
      )
      .subscribe((result: IMenuLink[]) => {
        result.forEach(r => r.isFavorite = true);
        this.favoritesList.next(result);
      }));
  }


  errorCatchHandler(action: string, errorStatus: number, expectedStatus: number, link: IMenuLink): number {
    let response: number;
    if (errorStatus !== expectedStatus) {
      link.isFavorite = false;
      console.log('error to ' + action + ' favorites, status code: ' + expectedStatus);
      response = errorStatus;
    } else {
      response = expectedStatus;
    }
    return response;
  }


  favoriteResponseHandler(statusCode: number, expectedStatus: number, link: IMenuLink, isFavorite: boolean): void {
    link.isFavorite = (statusCode || statusCode === 0) && statusCode !== expectedStatus ? !isFavorite : isFavorite;
    link.isLocked = false;
  }

  addFavorite(link: IMenuLink): void {
    this.apiService.getEndpoints(endpoints => {
      this.http.post(endpoints.favorites, link.id)
        .pipe(
          catchError((error) => {
            return of(this.errorCatchHandler('add', error.status, 201, link));
          })
        )
        .subscribe((statusCode: number) => {
          this.favoriteResponseHandler(statusCode, 201, link, true);
        });
    });
  }

  removeFavorite(link: IMenuLink): void {
    this.apiService.getEndpoints(endpoints => {
      this.http.request('DELETE', endpoints.favorites + '/' + link.id)
        .pipe(
          catchError((error) => {
            return of(this.errorCatchHandler('remove', error.status, 204, link));
          })
        )
        .subscribe((statusCode: number) => {
          this.favoriteResponseHandler(statusCode, 204, link, false);
        });
    });
  }

  favoriteImgSrc(isFavorite: boolean): string {
    let favoriteIcon: string = '';
    if (isFavorite) {
      favoriteIcon = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMzlEM0FDQkI5QTUxMUU4OUVFRUY0NzBDQjkzMEY4RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMzlEM0FDQ0I5QTUxMUU4OUVFRUY0NzBDQjkzMEY4RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUzOUQzQUM5QjlBNTExRTg5RUVFRjQ3MENCOTMwRjhEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUzOUQzQUNBQjlBNTExRTg5RUVFRjQ3MENCOTMwRjhEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgADwAPAwERAAIRAQMRAf/EAHUAAAMBAAAAAAAAAAAAAAAAAAEDBgkBAAIDAQAAAAAAAAAAAAAAAAIFAQMGBxAAAQMCBgMBAAAAAAAAAAAAAQIDBBEFADESEwYHISIVQREAAgECBQIGAwAAAAAAAAAAAQIRMQMAIRIEBUEGUYEiExQHkTJC/9oADAMBAAIRAxEAPwDZzmPPY6oVwssGPLjT1nYkOPIDYQmvuB7E1I8ZZHHJO7u+rTbe7srCXFun0sWAWB/XUmSMqUMzjXcRwTC4l5ypWogzPh0w2B2G3MskiJsS/uMW55RkIQlTetppR3SQqoHipqMWbH7ATc8e1rTc+StljqABXUqn1zMikmRXAX+3zb3AeV9suMpzgmlPKuJDtS0fd5ZAiNzrdaWmICFTbhPktx0aluLoKKOpZCQKUBz/ADCX7E40cjy9u0ty1aC2xqe46pUtAzOpiABEA1zjDbtfd/F2TOVdyWMKqlqAeQz8TgcBtKotk7Csj023OPPW9Qj3dqS27G23WXkFSnkE6EJIBVUAjMjA9mcb7Oz5LaM9osbRi4HVk0srrJdZ0qDBMwRUjE89ug+42t4K8B81KkNIKn9TUmgj84//2Q==';
    } else {
      favoriteIcon = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMzQ1OEExMkI5QTUxMUU4OUU5RERDMjZBNzFBNEEyOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMzQ1OEExM0I5QTUxMUU4OUU5RERDMjZBNzFBNEEyOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkYzNDU4QTEwQjlBNTExRTg5RTlEREMyNkE3MUE0QTI5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkYzNDU4QTExQjlBNTExRTg5RTlEREMyNkE3MUE0QTI5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgADwAPAwERAAIRAQMRAf/EAFsAAQEBAAAAAAAAAAAAAAAAAAEDCQEBAAAAAAAAAAAAAAAAAAAAABAAAgICAgEEAwAAAAAAAAAAAgMEBQEGERIAITETBxQVFhEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A2bmXlj9kR3a3V63Z1NK6biHtd1PbCV0ipPtKiChUlsjDHiPxZ7qHGAPJc+3IS/otnhV0XQrqstI+0WcV9VUbrFODIQ9orJYWOVDJ/JDrjq1nZGBEucc5xxyBOsdgT9o30fU6Bdo79DVhZSnyhhwFvY+XnvLMBa02AkA+MQUWc4LjJAPr4BrdnsD933orPWwr9mXr9a2mr5M0GRm5E5gMXGmLWR4jkwFZIspEsZLkl84xjwP/2Q==';
    }
    return favoriteIcon;
  }

  favoriteClick(link: IMenuLink): void {
    if (!link.isLocked) {
      link.isLocked = true;
      const isFavorite: boolean = link.isFavorite === undefined ? true : !link.isFavorite;
      if (isFavorite) {
        this.addFavorite(link);
      } else {
        this.removeFavorite(link);
      }
    }
  }
}
