/* 
In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:

- Nome completo della città e paese da  /destinations?search=[query]
(result.name, result.country, nelle nuove proprietà city e country).

- Il meteo attuale da /weathers?search={query}
(result.temperature e result.weather_description nella nuove proprietà temperature e weather).

- Il nome dell’aeroporto principale da /airports?search={query}
(result.name nella nuova proprietà airport).

Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

Note del docente
Scrivi la funzione getDashboardData(query), che deve:
- Essere asincrona (async).
- Utilizzare Promise.all() per eseguire più richieste in parallelo.
- Restituire una Promise che risolve un oggetto contenente i dati aggregati.
- Stampare i dati in console in un messaggio ben formattato.
- Testa la funzione con la query "london"

*/

async function fetchJson(url) {
    const response = await fetch(url)
    const obj = response.json()
    return obj
}

const getDestination = async (query) => {

    let destination
    try {
        destination = await fetchJson(`http://localhost:3333/destinations?search=${query}`)
    } catch (error) {
        throw new Error(`Non posso recuperare la destinazione ${query}`)
    }

    return destination.length > 0 ? destination : null;
}

const getWeather = async (query) => {

    let weather
    try {
        weather = await fetchJson(`http://localhost:3333/weathers?search=${query}`)
    } catch (error) {
        throw new Error(`Non posso recuperare il meteo della destinazione ${query}`)
    }

    return weather.length > 0 ? weather : null;
}

const getAirport = async (query) => {
    let airport
    try {
        airport = await fetchJson(`http://localhost:3333/airports?search=${query}`)
    } catch (error) {
        throw new Error(`Non posso recuperare l'aeroporto della destinazione ${query}`)
    }

    return airport.length > 0 ? airport : null;
}

async function getDashboardData(query) {
    try {
        const infos = await Promise.all([getDestination(query).catch(() => null), getWeather(query).catch(() => null), getAirport(query).catch(() => null)])
        console.log(infos);
        const [destination, weather, airport] = infos

        return {
            city: destination ? destination[0].name : null,
            country: destination ? destination[0].country : null,
            temperature: weather ? weather[0].temperature : null,
            weather: weather ? weather[0].weather_description : null,
            airport: airport ? airport[0].name : null
        }

    } catch (error) {
        console.error(error)
    }



}

getDashboardData('vienna')
    .then(data => {
        console.log('Dasboard data:', data);
        console.log(`${data.city} is in ${data.country}.`)

        if (data.temperature && data.weather) {
            console.log(`Today there are ${data.temperature} degrees and the weather is ${data.weather}.`);
        }

        if (data.airport) {
            console.log(`The main airport is ${data.airport}.`);
        }
    })
    .catch(error => console.error(error));