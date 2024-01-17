import './App.css'
import Map, {Marker, useMap} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {useEffect, useState} from "react";
import axios from "axios";


type PropsFlyToMarker = {
    position: {
        latitude: number,
        longitude: number
    }
}

function FlyToMarker({position}: PropsFlyToMarker) {
    const {current: map} = useMap();

    useEffect(() => {
        if (map && position) {
            map.flyTo({center: [position.longitude, position.latitude]});
        }
    }, [map, position]);

    return (
        // url for the marker
        <img src="https://www.flaticon.com/free-icon/placeholder_148836" alt=""/>
    );
}

type DataHost = {
    ip: string,
    location : string,
    timezone: string,
    isp: string
}

function App() {
    const [position, setPosition] = useState({latitude: 4.75, longitude: 7.4785});
    const [host, setHost] = useState('')
    const [dataHost, setDataHost] = useState<DataHost>({
        ip: '',
        location: '',
        timezone: '',
        isp: ''
    })

    const getData = async () => {

            const { data } = await axios.get(`http://ip-api.com/json/${host}`)
            console.log(data)
            if (data.status === 'fail') {
                return
            }
            if (data) {
                setPosition({latitude: parseFloat(data.lat), longitude: parseFloat(data.lon)})
                setDataHost({
                    ip: data.query,
                    location: `${data.city}, ${data.country}`,
                    timezone: `UTC${data.timezone}`,
                    isp: data.isp
                })
            }

    }

    return (
        <>
            <header className={"flex flex-col items-center gap-6 py-20"}>
                <h1 className={"text-4xl font-bold"}>IP Address Tracker</h1>
                <div className={"flex w-full h-full justify-center"}>
                    <input placeholder={'Search for any IP address or domain'} type="text" value={host}
                            onChange={(e) => setHost(e.target.value)}
                           className={"bg-white w-1/4 px-4 py-4 rounded-s-lg flex gap-2 text-gray-500"}/>
                    <span className={"bg-black h-full rounded-e-lg px-5 py-4 cursor-pointer "} onClick={getData}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </header>
            <div className={"bg-white xl:w-2/4 2xl:w-2/5  py-7 translate-y-[-50%] translate-x-[-50%] absolute inset-y-50 left-2/4 z-10 px-4 rounded-lg"}>
                <div className={"flex justify-start items-center gap-10"}>
                    <div className={"flex flex-col items-start gap-2"}>
                        <span className={"text-gray-500 font-bold uppercase"}>IP ADDRESS</span>
                        <span className={"text-sm text-black font-bold"}>
                                {dataHost.ip}
                        </span>
                    </div>
                    <div className={"h-20 w-px bg-gray-300"}></div>
                    <div className={"flex flex-col items-start gap-2"}>
                        <span className={"text-gray-500 font-bold uppercase"}>Location</span>
                        <span className={"text-sm text-black font-bold"}>
                                {dataHost.location}
                        </span>
                    </div>
                    <div className={"h-20 w-px bg-gray-300"}></div>
                    <div className={"flex flex-col items-start gap-2"}>
                        <span className={"text-gray-500 font-bold uppercase"}>Timezone</span>
                        <span className={"text-sm text-black font-bold"}>
                                {dataHost.timezone}
                        </span>
                    </div>
                    <div className={"h-20 w-px bg-gray-300"}></div>
                    <div className={"flex flex-col items-start gap-2"}>
                        <span className={"text-gray-500 font-bold uppercase"}>ISP</span>
                        <span className={"text-sm text-black font-bold"}>
                                {dataHost.isp}
                        </span>
                    </div>
                </div>
            </div>
            <Map
                initialViewState={{
                    ...position,
                    zoom: 5
                }}
                style={{width: '100%', height: 1000}}
                mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAP_API}`}
            >
                <Marker longitude={position.longitude} latitude={position.latitude}>

                </Marker>
                <FlyToMarker position={position}/>
            </Map>
        </>
    );
}

export default App;
