<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]-->
[![LinkedIn][linkedinbadge]][linkedinurl]

<!-- PROJECT LOGO -->
<br/>
<div align="center">
  <h3 align="center">GeoHeat</h3>
  <p align="center">
    A web platform to visualize NRT active fires across the Earth
    <br/>
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
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

No JS frameworks, everything in this project it's built from scratch to maximize the knowledge and simplicity.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Before using the platform you must have acquire a FIRMS API key.

### Prerequisites

* Sign up [here][firmskeyurl] with your email. You should receive an API key to request FIRMS data.

**Caution**: This key allows you to use GeoHeat services, keep it secret and do not share it with anyone.

### Accessing the platform

1. Access to [GeoHeat][geoheaturl] and introduce your key. There is no need to create an user or enter personal information.
2. Enjoy!
3. Yes, that's all! :smile:

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
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
