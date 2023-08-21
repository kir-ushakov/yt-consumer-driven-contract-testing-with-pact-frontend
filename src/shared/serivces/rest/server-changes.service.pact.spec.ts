import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Matchers } from '@pact-foundation/pact-web';
import { IChangeDTO } from '../../dto/change.dto';
import { IChangeableObjectDTO } from '../../dto/changeable-object.dto';
import { EChangeType } from '../../models/change.interface';
import { ServerChangesService } from './server-changes.service';
import { provider } from '../../../../tests/pact/providers/provider';

describe('Pact with Changes API Sync API', () => {
  const { like, term, eachLike } = Matchers;

  let serverChangesService: ServerChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });

    serverChangesService = TestBed.inject(ServerChangesService);
  });

  describe('when a call to get changes is made', () => {
    const CLIENT_ID = '63204391a3781200348d45a9';
    const SERVER_TASK_ID_1 = 'SERVER_TASK_ID_1';
    const DATE_OF_CREATION = new Date(2021, 0, 5);
    const changeableObjectDto: IChangeableObjectDTO = {
      id: SERVER_TASK_ID_1,
      modifiedAt: DATE_OF_CREATION.toISOString(),
    };

    beforeAll(async () => {
      await provider.addInteraction({
        state: `has changes relative to the client`,
        uponReceiving: `a request to get changes`,
        withRequest: {
          method: 'GET',
          path: '/api/sync/changes',
          query: `clientId=${CLIENT_ID}`,
        },
        willRespondWith: {
          status: 200,
          body: {
            changes: eachLike({
              type: term({
                generate: 'CHANGE_TYPE_TASK_CREATED',
                matcher: 'CHANGE_TYPE_TASK_CREATED|CHANGE_TYPE_TASK_MODIFIED',
              }),
              object: like(changeableObjectDto),
            }),
          },
        },
      });
    });

    it('should return changed task', async () => {
      const result: IChangeDTO[] = await serverChangesService.getChanges(
        CLIENT_ID
      );
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        type: EChangeType.TaskCreated,
        object: changeableObjectDto,
      });
    });
  });
});
