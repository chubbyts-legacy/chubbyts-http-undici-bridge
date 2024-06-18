import type { Stream } from 'stream';
import { PassThrough } from 'stream';
import { describe, expect, test } from 'vitest';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import type { ServerRequestFactory, UriFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Request as UndiciRequest } from 'undici';
import type { Response, ServerRequest, Uri } from '@chubbyts/chubbyts-http-types/dist/message';
import { Method } from '@chubbyts/chubbyts-http-types/dist/message';
import { createResponseToUndiciFactory, createUndiciToServerRequestFactory } from '../src/undici-http';

const streamToString = async (stream: Stream): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const list: Array<Uint8Array> = [];

    // eslint-disable-next-line functional/immutable-data
    stream.on('data', (chunk) => list.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(list).toString('utf-8')));
    stream.on('error', (error) => reject(error));
  });
};

describe('undici-http', () => {
  describe('createUndiciToServerRequestFactory', () => {
    test('without body', () => {
      const req = new UndiciRequest('http://localhost/api?key=value', {
        method: 'get',
        headers: {
          accept: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, ',
          'x-custom-one': '  value1',
          'x-custom-two': '  ',
        },
      });

      const uri: Uri = {
        schema: 'http',
        userInfo: '',
        host: 'localhost',
        port: 443,
        path: '/api',
        query: { key: 'value' },
        fragment: '',
      };

      const serverRequest: ServerRequest = {
        method: Method.GET,
        uri,
        attributes: {},
        protocolVersion: '1.0',
        headers: {},
        body: new PassThrough(),
      };

      const [uriFactory, uriFactoryMocks] = useFunctionMock<UriFactory>([
        { parameters: ['http://localhost/api?key=value'], return: uri },
      ]);

      const [serverRequestFactory, serverRequestFactoryMocks] = useFunctionMock<ServerRequestFactory>([
        { parameters: [Method.GET, uri], return: serverRequest },
      ]);

      const undiciToServerRequestFactory = createUndiciToServerRequestFactory(uriFactory, serverRequestFactory);

      const { body: _, ...rest } = undiciToServerRequestFactory(req);

      expect(rest).toMatchInlineSnapshot(`
        {
          "attributes": {},
          "headers": {
            "accept": [
              "text/html",
              "application/xhtml+xml",
              "application/xml;q=0.9",
              "image/webp",
              "*/*;q=0.8",
            ],
            "x-custom-one": [
              "value1",
            ],
          },
          "method": "GET",
          "protocolVersion": "1.0",
          "uri": {
            "fragment": "",
            "host": "localhost",
            "path": "/api",
            "port": 443,
            "query": {
              "key": "value",
            },
            "schema": "http",
            "userInfo": "",
          },
        }
      `);

      expect(uriFactoryMocks.length).toBe(0);
      expect(serverRequestFactoryMocks.length).toBe(0);
    });

    test('with body', async () => {
      const req = new UndiciRequest('http://localhost/api?key=value', {
        method: 'post',
        headers: {
          accept: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, ',
          'content-type': 'application/json',
        },
        body: '{"key":"value"}',
      });

      const uri: Uri = {
        schema: 'http',
        userInfo: '',
        host: 'localhost',
        port: 443,
        path: '/api',
        query: { key: 'value' },
        fragment: '',
      };

      const serverRequest: ServerRequest = {
        method: Method.POST,
        uri,
        attributes: {},
        protocolVersion: '1.0',
        headers: {},
        body: new PassThrough(),
      };

      const [uriFactory, uriFactoryMocks] = useFunctionMock<UriFactory>([
        { parameters: ['http://localhost/api?key=value'], return: uri },
      ]);

      const [serverRequestFactory, serverRequestFactoryMocks] = useFunctionMock<ServerRequestFactory>([
        { parameters: [Method.POST, uri], return: serverRequest },
      ]);

      const undiciToServerRequestFactory = createUndiciToServerRequestFactory(uriFactory, serverRequestFactory);

      const { body, ...rest } = undiciToServerRequestFactory(req);

      expect(rest).toMatchInlineSnapshot(`
        {
          "attributes": {},
          "headers": {
            "accept": [
              "text/html",
              "application/xhtml+xml",
              "application/xml;q=0.9",
              "image/webp",
              "*/*;q=0.8",
            ],
            "content-type": [
              "application/json",
            ],
          },
          "method": "POST",
          "protocolVersion": "1.0",
          "uri": {
            "fragment": "",
            "host": "localhost",
            "path": "/api",
            "port": 443,
            "query": {
              "key": "value",
            },
            "schema": "http",
            "userInfo": "",
          },
        }
      `);

      expect(await streamToString(body)).toMatchInlineSnapshot('"{"key":"value"}"');

      expect(uriFactoryMocks.length).toBe(0);
      expect(serverRequestFactoryMocks.length).toBe(0);
    });
  });

  test('createResponseToUndiciFactory', async () => {
    const body = new PassThrough();
    body.end('{"key":"value"}');

    const response: Response = {
      status: 200,
      reasonPhrase: 'OK',
      protocolVersion: '1.0',
      headers: { 'content-type': ['application/json'] },
      body,
    };

    const responseToUndiciFactory = createResponseToUndiciFactory();

    const undiciResponse = responseToUndiciFactory(response);

    expect(undiciResponse.status).toBe(200);
    expect(undiciResponse.statusText).toBe('OK');

    expect(Array.from(undiciResponse.headers.entries())).toMatchInlineSnapshot(`
      [
        [
          "content-type",
          "application/json",
        ],
      ]
    `);

    expect(await undiciResponse.json()).toMatchInlineSnapshot(`
      {
        "key": "value",
      }
    `);
  });
});
