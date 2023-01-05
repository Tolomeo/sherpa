# Contributing

The project uses `Next.js` with `Typescript`, `eslint` and `prettier` for code checks and formatting, `yarn` as package manager.<br/>
To contribute:

1. Fork the project
2. Create your Feat branch (ex: `Feat/cobol-path`)
3. Commit and push your changes
4. Open a pull request

## Scripts

```bash
# Installing dependencies
yarn
# Launching Next dev server
yarn dev
```

See `/package.json` for all available scripts.

## How to add paths and resources

Json files are used as sources to compile path static pages.

You will find resources in `/data/resources`.
`/data/resources/utils.ts` contains resources' schema definition.
To add resources for a path, create a new json file here (ex: `/data/resources/cobol.json`) containing an array of resources.
Import and spread the new resources in `/data/resources/index.ts`.

You will find paths definitions in `/data/paths`.
Paths list only the url of resources and they will be enriched with full data at build time.
`/data/paths/utils.ts` contains paths' schema definition.
To add a path create a new json file here (ex: `/data/paths/cobol.json`) containing the path.
Import the newly created path and add it to other paths in `/data/paths/index.ts`.

## Guidelines

Gathering and organising learning resources mostly involves an intense content curation type of effort.
Following are criteria which lead the creation of paths and selection of resources.

### Creating and updating paths

I could be useful to keep in mind the following propositions when creating or updating a learning path:

- The goal of a learning path in Sherpa is to offer a user enough direction to guide them from beginner to intermediate level.
  Once finished with main resources, the user should have fundamentals solid enough to progress on their own.
- Paths suggested as requirements for a learning path contain knowledge likely but not mandatorily needed to fully understand all topics explained. The path itself won’t necessarily contain any of those propaedeutic resources.
- Selected main resources are not necessarily the most complete ones. They are selected on the base of working well together with the goals of giving balanced progression, format variety and minimum overlapping.
- Resources suggested as alternative to the main ones overlap with them and could complement or even replace those when preferred.
- Resources listed as advanced should be accessible to a user who has completed the main path.
  They can help the user progress further or they can go in depth with topics already presented.
- Sub-paths resources should be accessible to a user who has completed the path main and they are meant to be simplified and self contained. Sub-paths main resources selection follows the same criteria of path main resources.
- The number of other extra sections may vary, especially when the path topic is wide and there are entire sub-topics with worthy resources which would make the main path too long.
  When it is not possible instead to group an extra resource into a specific additional section, they generally ends up in:
  ”How do they do it?”: examples and tutorials
  ”Nice to know”: indirectly related information and curiosities
  ”Great bookmarks”: tools, utilities and references to go back to
  ”Stay in the loop”: blogs, newsletters, podcasts to stay updated
- Paths suggested as possible continuation should be accessible to a user who has completed the path main.
- The overall number of resources present in a path should be enough to make it rich without feeling overwhelming. The acceptable quantity of resources mostly depends on how wide the path topic is.

### Selecting resources

Evaluating the quality of a resource for it to be included in a path is more difficult than it seems.
Following is a list of questions which could help making a decision.
Sometimes there are several resources or combinations of them which would all make for a good path. In those cases, the decision will most likely be arbitrary.

Is the resource …

- … free?
  _Yes. It has to be._
- … designed to remain free with no constraints?
  _There are amazing resources accessible without paying for a limited period of time thanks to trial periods, limited number of accesses and the likes. Unfortunately those are not strictly free._
- … easy to access and easy to consume?
  _It should be clear where the content is and transparent how to consume it._
- … explicitly or implicitly designed to provide educational content?
  _The main purpose of a resource should be to share knowledge. This would, for example, exclude resources which main goal is the promotion of a product._
- … having clear purpose and boundaries?
  _Resource contents should be consistent and should make sense with their premises. Their scope and limits should be clear._
- … covering established knowledge and principles not likely to change in the short term?
  _It should be left to the will of the user to inform themselves on temporary trends._
- … complementing the rest of resources?
  _Resources should offer a consistent learning experience, giving the chance to swap one resource for another one if needed. Controversial content would possibly add confusion, although it could find a good spot among curiosities and related resources._
- … comprehensive and self contained?
  _Resources should be exhaustive relatively to their declared scope. Bite-size articles, quick tips and similar resources are possibly not adding enough to the table._
- … providing educational value to the path by dealing with topics not covered, not fully covered or not covered in the same format by other resources?
  _Having several similar alternatives gives value because the user will be able to make a choice. Too many resources on the same topics and presented in the same way add redundancy, though._
- … adding a quality alternative to other resources which have few alternatives?
  _High quality resources add value even when they have already alternatives in the path._
- … allowing for automated maintenance checks?
  _Resources are periodically checked to make sure they remain healthy. The automated check is simple and based on the resource title. Some platforms have strong protection against similar checks and that lowers the maintainability score of the project._
- … updated?
  _Technology moves fast. It is possible for a resource which doesn’t receive updates since years to be still relevant. That needs to be researched, though._
- … likely to be regularly updated by its creator?
  _Some blog writers or publication websites take care of keeping contents of their articles up to date._
- … well curated and presented?
  _Given a resource provides quality educational content, the learning experience will be better when the presentation of such content is also good._
- … having a table of contents, in the case of it being a part of a series?
  _Many long articles or videos get split into multiple parts. The parts are easier to access and navigate when they offer a way to browse the list of all the parts._
- … presented in a balanced and non opinionated way?
  _For a beginner it is difficult to make a distinction between what represents principles widely agreed upon and what instead is a personal opinion._
