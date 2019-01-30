# Prior Art Archive Site


## To Install

```
npm install
```

## To Run Dev Mode

```
npm start
```
Navigate to `localhost:8765`

## Storybook

To build and test components, we use Storybook. To run:

```
npm run storybook
```

Navigate to `localhost:9001`	

## To Build and Run Production Version

```
npm run prod
```

Navigate to `localhost:8765`


# Architecture
The following diagram depicts the architecture for the Prior Art Archive and all associated services. The blocks are described below:

![Prior Art Archive architecture diagram](https://i.imgur.com/1mGeoFZ.png)

- **FTP client:** A user's personal FTP client. They should login using the username and password they setup when they signed up.
- **priorart-sftp-authentication:** A lambda trigger that validates against the user database to authenticate the secure FTP session. [Code available here](https://github.com/knowledgefutures/priorart-sftp-authentication).
- **SFTP Server:** A hosted AWS Transfer SFTP server. Users are jailed to their home directory and cannot see files uploaded by other users. The SFTP server is a means of uploading, not file management. Removing files from the SFTP server does not delete them from the Prior Art Archive.
- **priorart-sftp-copy:** A lambda trigger that adds metadata and copies the SFTP-uploaded files to the primary file storage. [Code available here](https://github.com/knowledgefutures/priorart-sftp-copy).
- **Primary File Storage:** An S3 bucket that hosts all the content uploaded by users.
- **priorart-site:** The main repo for the Prior Art Archive project. [Code available here](https://github.com/knowledgefutures/priorart-site). This repo implements the client facing site as well as the required backend. API endpoints that talk to the Prior Art Archive Postgres DB are implemented here.
	- **User authentication:** An API route that authenticates users for SFTP and site login.
	- **Drag-and-drop upload:** An interface that allows users to directly upload files through the site.
	- **Sitemap generator:** An interface that produces a sitemap of all assets. Used by Google to generate CPC codes.
	- **Search input:** An endpoint that takes a users string input.
	- **Search results:** An interface that presents a list of search results.
- **priorart-search-parser:** A lambda trigger that takes the string input from a user and parses it into an ElasticSearch query object.
- **ElasticSearch:** An elastic.co hosted ElasticSearch cluster.
- **priorart-file-parser:** A server deployment on Elastic Beanstalk that implements Tika parsing, formats metadata as Underlay assertions, and writes content to the Postgres DB, Elasticsearch, and the Underlay. [Code available here](https://github.com/knowledgefutures/priorart-file-parser).
	- **tika:** Tika server that extracts metadata from a file.
	- **underlay formatter:** Parses metadata into JSON-LD compliant Underlay assertions.
- **Underlay cluster:** The Underlay cluster that serves as ground truth for all data in the Prior Art Archive. [Details about the Underlay cluster can be found here](https://kfg.mit.edu/pub/l18rh143).
- **Postgres DB:** A hosted Postgres DB that serves user and document information for the user-facing site.
- **Google CPC Generation:** A black box run by Google that generates CPC codes from files.
- **CPC Ingestion:** A server that ingests CPC code metadata from Google and writes it to the Underlay cluster, Elasticsearch, and the Postgres DB.



# Code Practices

## Containers vs Components

The client side code follows a [Container/Component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) split as is common in React-based sites. The structure and difference between the two in this repo is not exactly as described in the preceeding article. For this repo, the following describes how containers and components are differentiated:

### Containers
- Associated with a specific URL route
- One a single container is used on a given URL route
- Calls hydrateWrapper() to initialize React bindings after using server-side renered HTML for immediate display.
- Holds the ground truth data for a given view. Often the ground truth data is passed into containers as props through hydrateWrapper(), but in cases where the ground truth data is being changed, the container will hold ground truth data in it's state.

### Components
- All other non-container components :)
- Many components are used within a given URL route
- Can store it's own state if needed for UX functionality - but should always update the ground truth data held in its parent container.
- Can make it's own API requests when the functionality and layout of the pertaining request is contained within the single component. Though if this request influences the ground truth data, the component should be passed an updating function that allows it to update the ground truth data held in the container.

## Commits

Preferred practice is to prefix commits with one of the following categories:
- `fix`: for commits focused on specific bug fixes
- `feature`: for commits that introduce a new feature
- `update`: for commits that improve an existing feature
- `dev`: for commits that focus solely on documentation, refactoring code, or developer experience updates



