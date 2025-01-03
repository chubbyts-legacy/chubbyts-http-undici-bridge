import { Duplex } from 'stream';
import type { Method, ServerRequest, Response } from '@chubbyts/chubbyts-http-types/dist/message';
import type { UriFactory, ServerRequestFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import type { Request as UndiciRequest } from 'undici';
import { Response as UndiciResponse } from 'undici';

type UndiciToServerRequestFactory = (req: UndiciRequest) => ServerRequest;

export const createUndiciToServerRequestFactory = (
  uriFactory: UriFactory,
  serverRequestFactory: ServerRequestFactory,
): UndiciToServerRequestFactory => {
  return (req: UndiciRequest): ServerRequest => {
    const uri = uriFactory(req.url);

    const headers = Object.fromEntries(
      Array.from(req.headers.entries())
        .map(([name, value]) => [
          name,
          value
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part),
        ])
        .filter(([_, value]) => value.length),
    );

    return {
      ...serverRequestFactory(req.method.toUpperCase() as Method, uri),
      headers,
      ...(req.body ? { body: Duplex.from(req.body) } : {}),
    };
  };
};

type ResponseToUndiciFactory = (response: Response) => UndiciResponse;

export const createResponseToUndiciFactory =
  (): ResponseToUndiciFactory =>
  (response: Response): UndiciResponse => {
    return new UndiciResponse(response.body.iterator(), {
      status: response.status,
      statusText: response.reasonPhrase,
      headers: Object.entries(response.headers).map(([name, value]) => [name, value.join(',')]),
    });
  };
