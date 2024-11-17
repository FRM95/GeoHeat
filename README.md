<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![LinkedIn][linkedinbadge]][linkedinurl]

<!-- PROJECT LOGO -->
<br/>
<div align="center">
  <h3 align="center">GeoHeat (Paused Project)</h3>
  <p align="center">
    A web platform to visualize NRT active fires across the Earth
    <br/>
    <a href="#"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="#readme-demo">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

### The first idea

This project was born as an old idea during my Master's degree in Big data, where I created a simple web platform with [Streamlit][streamliturl] to collect and display fire spots around the Earth.
The idea was pretty simple:
* Collect, process, and parse fire data directly from the [FIRMS][firmsurl] NASA API.
* Display those fire spots with the help of [Open Street Map][opentreetmapurl] 2D maps.

However this was a simple project, so I was always thinking about making a major improvement on that idea...

After a few months, I started to work as a Data Developer, and one day we aimed to create a solution to combine machine learning with some KPI's visualization, and geospatial data representation through interactive maps. 
Our developer stack was just Python and some Data libraries (nothing weird for a Data and Analytics department) and the project started to grow. 
More and more features, user authentication... forget about using just Python let's move into web development.

We decided to start with Flask for the Backend and JavaScript, HTML, and CSS for the FrontEnd, and after a long time, we did it, and the project was a complete success.
I was the one in charge of creating the platform itself (more like a Fullstack Developer), and I was super happy about the result, It was my first time with web development.

Now we are in 2024, and from time to time I used to remember that old project, so with the new skills learned I decided to get into it. 
But why should be the same concept as before? I could create a similar (keeping the distances) platform to Carto or Google Maps but no! I must introduce a new area into this project: 3D art.

### Built With

This is what I used to create it:

* [![Flask][flaskbadge]][flaskurl]
* [![Three.js][threejsbadge]][threejsurl]
* [![Javascript][javascriptbadge]][javascripturl]
* [![HTML5][htmlbadge]][htmlurl]
* [![CSS3][cssbadge]][cssurl]
* [![MongoDB][mongodbbadge]][mongodburl]

No JS frameworks, everything in this project is built from scratch to maximize knowledge and simplicity.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Before using the platform you must have acquired a FIRMS API key.

### Prerequisites

* Sign up [here][firmskeyurl] with your email. You should receive an API key to request FIRMS data.

**Caution**: This key is essential to use GeoHeat services, keep it secure, and do not share it with anyone.

### Accessing the platform

1. Access to [GeoHeat][geoheaturl] and introduce your key. There is no need to create a user or enter personal information.
2. Enjoy!
3. Yes, that's all! :smile:

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

GeoHeat platform preview
<a id="readme-demo"></a>

![geoheat-capture-1](https://github.com/user-attachments/assets/de32545b-04cf-465e-9299-d850cc0f1569)

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples, and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Initial structure
- [x] Initial Data model
- [x] Home design
- [ ] Login design
- [ ] Backend, authentication, and endpoints
- [ ] MongoDB connection
- [ ] Deploy platform

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are not allowed for the moment.

If you have a suggestion that would make this project better, do not hesitate and contact me! 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Miguel Moreno Mardones - [LinkedIn][linkedinurl] - miguelmm2507@gmail.com

Project Link: [GeoHeat Github][projecturl]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

This project wouldn't be possible without this:

* [NASA FIRMS][firmsurl]
* [Create the Earth with THREE.js - Robot Bobby ](https://www.youtube.com/watch?v=FntV9iEJ0tU&t=567s)
* [Earth textures](https://planetpixelemporium.com/earth8081.html?PayerID=HYTPQXJQUZPRN)
* [Platform font - Google Fonts](https://fonts.google.com/?query=Quicksand)
* [Bootstrap Icons](https://react-icons.github.io/react-icons/search)
* [Seed your MongoDB container](https://shantanoo-desai.github.io/posts/technology/seeding-mongodb-docker-compose/)
* [Readme Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[projecturl]: https://github.com/FRM95/GeoHeat
[geoheaturl]: https://github.com/FRM95/GeoHeat
[product-screenshot]: images/screenshot.png
[linkedinbadge]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedinurl]: https://linkedin.com/in/miguelm25m
[streamliturl]: https://streamlit.io/
[firmsurl]: https://firms.modaps.eosdis.nasa.gov/
[opentreetmapurl]: https://www.openstreetmap.org/
[firmskeyurl]: https://firms.modaps.eosdis.nasa.gov/api/map_key/
[flaskurl]: https://flask.palletsprojects.com/en/3.0.x/
[flaskbadge]: https://img.shields.io/badge/Flask-52BBE6?logo=flask&logoColor=black&logoWidth=20
[threejsurl]: https://threejs.org/
[threejsbadge]: https://img.shields.io/badge/Threejs-A9792B?logo=threedotjs&logoColor=black&logoWidth=20
[javascripturl]: https://developer.mozilla.org/en/docs/Web/JavaScript
[javascriptbadge]: https://img.shields.io/badge/Javascript-F7DF1E?logo=javascript&logoColor=black&logoWidth=20
[mongodburl]: https://www.mongodb.com/es
[mongodbbadge]: https://img.shields.io/badge/MongoDB-02B78F?logo=mongodb&logoColor=black&logoWidth=20
[htmlurl]: https://developer.mozilla.org/en/docs/Web/HTML
[htmlbadge]: https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=black&logoWidth=20
[cssurl]: https://developer.mozilla.org/en/docs/Web/CSS
[cssbadge]: https://img.shields.io/badge/CSS-4051B5?logo=css3&logoColor=black&logoWidth=20
