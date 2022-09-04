export type Travel = {
    id: string;
    legs: Legs[];
    validUntil: string;
};

export type Legs = {
      id: string;
      providers: Providers[];
      routeInfo: RouteInfo;
};

export type Providers = {
    id: string;
    flightStart: string;
    flightEnd: string;
    price: number;
    company: Company;
};

export type RouteInfo = {
    id: string;
    distance: number;
    from: From;
    to: To;
};

export type Company = {
    id: string;
    name: string;
};

export type From = {
    id: string;
    name: string;
};

export type To = {
  id: string;
  name: string;
};

export type Reservation = {
    firstName?: string;
    lastName?: string;
    routes?: string;
    totalPrice?: number;
    travelTime?: string | number;
    companyName?: string;
}