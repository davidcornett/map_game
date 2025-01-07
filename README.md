# Border Canvas country-builder

Visit deployed website: [www.bordercanvas.com](http://www.bordercanvas.com)
Visit back-end repo: https://github.com/davidcornett/map_game_back

**Border Canvas**: Map-based game where the player creates a custom new country composed of US counties. Border Canvas includes a sandbox mode where players create custom countries within the US, gaining economic strength, population, demographics, natural resources, and national parks as desired. The game also includes a challenge mode where players compete for the most populous or wealthiest country in different size categores.

## Features

- **Sandbox Mode**: The player selects from 3 size categories measured in square miles (25,000/"The Netherlands", 100,000/"Vietnam", and 350,000/"Nigeria"), picks US counties for their country, and can choose a country name before completion. The new country is shown:
    - **Map**: Isolated map of the new country with its name (if applicable) as well as a map of its location within the US
    - **Total Population**
    - **Global Population Ranking**: Population ranking in the world
    - **Demographic Breakdown**: Percentage breakdowns of the population by ethnic group.
    - **National Parks**: Information and photos of any national park or national monuments in the country.
    - **Land Types**: square mileage of forest, agricultural land, and developed land
    - **Total GDP**
    - **Per-capita Income**
    - **Unemployment Rate**


- **Challenge Mode**: Database stores top results and user names for multiple challenges for each size category:
    - **Mazimize GDP**
    - **Maximize Income** - Minimum population of 3,000,000
    - **Maximize Population**
- **Error Handling**: 
    - **Contiguous counties**: a breadth-first search algorithm using an adjacency matrix ensures all selected counties are contiguous.
    - **Size requirements**: total area of the selected country must be under the chosen size category.


## Built With
- **Next.js**: React framework for the front-end
- **Leaflet JS**: JavaScript library for interactive maps
- **Python**: back-end programming language
- **Flask**: RESTful API
- **PostgreSQL**: database

## Deployment

The deployed version separates the front and back end into separate private repositories:

- **Front End**: Deployed on [Vercel](https://vercel.com/).
- **Back End**: Deployed on [Render](https://render.com/).
- **Database**: Deployed on [Neon](https://neon.tech/).

## Roadmap:
- **Additional country components of mountain peaks, rivers, military bases, and universities (2025-2026)**
- **Additional challenge modes for demographic make-up, national parks, and land cover (2025)**
- **China implementation (2026)**