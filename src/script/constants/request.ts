export const BASE_URL = 'https://technical-task-api.icapgroupgmbh.com/api';
export enum PARTIAL_URL {
  LOGIN = 'login',
  TABLE = 'table',
}

export enum REQUEST_METHODS {
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum RESPONSE_STATUS {
  Ok = 200,
  Created = 201,
  Deleted = 204,
  ServerError = 500,
}
