import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.const';
import { IChangeDTO } from '../../dto/change.dto';
import { HTTP_METHODS, RestService } from '../infrastructure/rest.service';

interface GetChangesResponceDTO {
  changes: IChangeDTO[];
}
@Injectable({
  providedIn: 'root',
})
export class ServerChangesService {
  constructor(private _restService: RestService) {}

  public async getChanges(clientId: string): Promise<IChangeDTO[]> {
    const response: any = await this._restService
      .makeRequest<GetChangesResponceDTO>(
        HTTP_METHODS.GET,
        API_ENDPOINTS.SYNC.CHANGES,
        { clientId }
      )
      .toPromise();
    const changesDto: Array<IChangeDTO> = response.changes;
    return changesDto;
  }
}
