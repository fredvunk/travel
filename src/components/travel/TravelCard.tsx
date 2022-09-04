import * as React from "react";
import {Providers, Reservation, RouteInfo} from "../model/travel";
import {getTotalFlightTime, parseDate} from "../../helper";

export type TravelCardProps = {
    route: RouteInfo;
    providers: Providers[];
    reservation?: Reservation;
    onClick: (reservation: Reservation) => void;
};

const TravelCard = (props: TravelCardProps) => {

    const handleOnClick = (data: Providers) => {
        props.onClick({
            ...props.reservation,
            routes: props.route.from.name + ' ' + props.route.to.name,
            totalPrice: data.price,
            travelTime: getTotalFlightTime(data.flightStart, data.flightEnd, false),
            companyName: data.company.name
        })
    };

    return (
        <div className="d-flex flex-row justify-content-between align-items-center bg-white p-2 rounded mb-2 w-100">
            <div className="d-flex justify-content-between align-items-center w-100">
                <div className="routeInfo">
                    <p>
                        From: {props.route.from.name}
                    </p>
                    <p>
                        To: {props.route.to.name}
                    </p>
                    <div className="distance">
                        <div>Distance:</div>
                        {props.route.distance}
                    </div>
                </div>
                <div className="providers text-light overflow-auto">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Company name</th>
                            <th>Price</th>
                            <th>Flight start</th>
                            <th>Flight end</th>
                            <th>Total flight time</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {props.providers.map((provider, index) => (
                            <tr key={index}>
                                <td>{provider.company.name}</td>
                                <td>{provider.price}</td>
                                <td>{parseDate(provider.flightStart)}</td>
                                <td>{parseDate(provider.flightEnd)}</td>
                                <td>{getTotalFlightTime(provider.flightStart, provider.flightEnd, false)}</td>
                                <td onClick={() => handleOnClick(provider)}><button className="btn btn-secondary">Book this flight</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TravelCard;