import { keyInYN, question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: 'omdb' });

async function main() {
    const running = true;
    await client.connect()
    console.log("Welcome to search-movies-cli!");
    while (true) {
        const searchString = question("Search for a movie: ").toLowerCase()
        if (searchString === '' || searchString === ' ') {
            console.log('Search term was empty.')
        }
        else {
            const searchStringFirstLetterUppercase = searchString[0].toUpperCase() + searchString.slice(1)
            console.log(`Searching for '${searchString}':`)
    
            const text = "SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE name LIKE $1 OR NAME LIKE $2 AND kind = $3 ORDER BY date DESC LIMIT 10"
            const values = [`%${searchString}%`, `%${searchStringFirstLetterUppercase}%`, 'movie']
            const res = await client.query(text, values)
            console.table(res.rows)
        }

        if (!keyInYN('Do you want to search for another movie?')) {
            break;
        }
    }
    await client.end();
}

main()

async function doDemo() {
    const client = new Client({ database: 'musicbase' });
    await client.connect();
    const res = await client.query("SELECT * from artists");
    console.log(res.rows);
    await client.end();
  }