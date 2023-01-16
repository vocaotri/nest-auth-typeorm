export interface ResponseDetailInterface {
  status: boolean;
  message: string;
  data: object;
}

export interface ResponseListInterface {
  status: boolean;
  message: string;
  data: object[];
}

export interface ResponseInterface {
  status: boolean;
  message: string;
}

export interface ResponseFailedInterface {
  status: boolean;
  message: string;
  data: any;
}