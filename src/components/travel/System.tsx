import {useEffect, useState} from "react";
import {getTravelData} from "../../services/services";
import {Providers, Reservation, RouteInfo, Travel} from "../model/travel";
import TravelCard from "./TravelCard";
import {getTotalFlightTime} from "../../helper";

const System = () => {
    const places = ["Earth", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
    const [travelRoutes, setTravelRoutes] = useState<RouteInfo[]>();
    const [providers, setProviders] = useState<Providers[]>();
    const [validUntil, setValidUntil] = useState<string>();
    const [selectedDestination, setSelectedDestination] = useState<string>();
    const [origin, setOrigin] = useState<string>();
    const [possibleRoutes, setPossibleRoutes] = useState<RouteInfo[] | undefined>();
    const [reservation, setReservation] = useState<Reservation | undefined>();
    const [storedReservation, setStoredReservations] = useState<Reservation>();

    useEffect(() => {
        getTravelData()
            .then((response: Travel) => {
                if (response) {
                    localStorage.setItem('validUntil', JSON.stringify(response.validUntil));
                    mapData(response);
                }
            })
            .catch((error) => console.log(error))
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('reservation') as string);
        if (data) {
            setStoredReservations(data);
        }
    }, []);

    const mapData = (data: Travel) => {
        const routes: RouteInfo[] = [];

        data.legs.forEach((data) => {
            routes.push(data.routeInfo);

            setTravelRoutes(routes);

            const providers = data.providers.map((provider) => {
                return provider;
            });

            setProviders(providers);
        });

        setValidUntil(data.validUntil);
    }

    const handleOriginChange = (event: any) => {
        setOrigin(event.target.value)
    };

    const handleDestinationChange = (event: any) => {
        setSelectedDestination(event.target.value);
    };

    const confirmTravelRoute = () => {
        if (travelRoutes) {
            const singleRoute = travelRoutes.filter(r => r.from.name === origin && r.to.name === selectedDestination);
            if (singleRoute.length > 0) {
                setPossibleRoutes(singleRoute);
            } else {
                // Couldn't get this to work.
                // idea was to use Depth-First search
                // const paths = findPaths(graphify(travelRoutes), origin, selectedDestination);
            }
        }
    };
    //
    // function *findPaths(graph: any, src: any, dst: string | undefined, path: any[] =[], visited: Set<any> =(new Set())): any {
    //     if (src === dst) {
    //         yield path.concat(dst);
    //     }
    //     else if (graph[src] && !visited.has(src)) {
    //         visited.add(src);
    //         path.push(src);
    //
    //         for (const neighbor of graph[src]) {
    //             yield *findPaths(graph, neighbor, dst, path, visited);
    //         }
    //
    //         visited.delete(src);
    //         // @ts-ignore
    //         path.pop(src);
    //     }
    // }
    //
    // const graphify = (routes: RouteInfo[]) => {
    //     const graph = {};
    //
    //     for (const node of routes) {
    //         // @ts-ignore
    //         if (!graph[node.from.name]) {
    //             // @ts-ignore
    //             graph[node.from.name] = [];
    //         }
    //         // @ts-ignore
    //         graph[node.from.name].push(node.to.name)
    //     }
    //
    //     return graph;
    // };

    const parseDate = (date: string | undefined) => {
        return date?.split('.')[0].replace('T', ' ').replace('Z', '');
    }

    const onChange = (key: keyof Reservation, value: string) => {
        setReservation(prevState => ({
            ...prevState,
            [key]: value
        }))
    };

    const onClick = (reservation: Reservation) => {
        const clone = {...reservation};
        setReservation(clone);

        localStorage.setItem('reservation', JSON.stringify(reservation));
        localStorage.setItem('validDateOnReservation', JSON.stringify(validUntil));
    };

    const onFilterApply = (providers: Providers[] | undefined, event: any) => {
        if (!providers) {
            return;
        }
        let data = providers;
        const e = event.target.id;

        switch (e) {
            case 'company':
                data.sort((a, b) => a.company.name.localeCompare(b.company.name));
                setProviders([...data]);
                break;
            case 'price':
                data.sort((a, b) => (a.price - b.price));
                setProviders([...data]);
                break;
            case 'distance':
                // not implemented
                break;
            case 'time':
                data.sort((a, b) =>
                    (getTotalFlightTime(a.flightStart, a.flightEnd, true) - getTotalFlightTime(b.flightStart, b.flightEnd, true)))
                setProviders([...data]);
                break;
            default:
                return;
        }
    };

    return (
        <div>
            <h1>All flights are valid until: {parseDate(validUntil)}</h1>
            <div>
                <h3>Select your origin and destination</h3>
                <div className="p-2">
                    Select your origin:
                    <select className="" onChange={handleOriginChange}>
                        <option selected disabled hidden value="none"/>
                        {places.map((route, index) => (
                            <option key={index} value={route}>{route}</option>
                        ))}
                    </select>
                </div>
                <div className="p-2">
                    Select your destination:
                    <select className="" onChange={handleDestinationChange}>
                        <option selected disabled hidden value="none"/>
                        {places.map((route, index) => (
                            <option key={index} value={route}>{route}</option>
                        ))}
                    </select>
                </div>
                <div>Confirm your travel route</div>
                <button onClick={() => confirmTravelRoute()}>Apply route</button>
            </div>

            <h2 className="mt-3">Filters</h2>
            <div className="d-flex justify-content-around">
                <div>
                    <button id="company" onClick={(event) => onFilterApply(providers, event)}>Company name</button>
                </div>
                <div>
                    <button id="price" onClick={(event) => onFilterApply(providers, event)}>Price</button>
                </div>
                <div>
                    <button id="distance" onClick={(event) => onFilterApply(providers, event)}>Distance</button>
                </div>
                <div>
                    <button id="time" onClick={(event) => onFilterApply(providers, event)}>Travel time</button>
                </div>
            </div>

            <h3>Routes</h3>
            <div>
                <h2>To Book a flight, please enter your name</h2>
                <label>First name</label>
                <input type="text" onChange={event => onChange('firstName', event.target.value)}/>
                <label>Last name</label>
                <input type="text" onChange={event => onChange('lastName', event.target.value)}/>
            </div>
            <div className="m-2">
                {providers && possibleRoutes && possibleRoutes.map((route) => (
                    <TravelCard
                        key={route.id}
                        route={route}
                        providers={providers}
                        reservation={reservation}
                        onClick={(reservation) => onClick(reservation)}
                    />
                ))}
            </div>
            {storedReservation && (
                <div>
                    <h3>Last Reservations</h3>
                    <p>Name: {storedReservation.firstName} {storedReservation.lastName}</p>
                    <p>Company name: {storedReservation.companyName}</p>
                    <p>Total Price: {storedReservation.totalPrice}</p>
                    <p>Total travel time: {storedReservation.travelTime}</p>
                    <p>Route: {storedReservation.routes}</p>
                </div>
            )}
        </div>
    );
};

export default System;
