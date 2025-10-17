# Enable your project for Universal Editor

Universal Editor is supported on Author Bus via Adobe's Early Access Technology program. You can store your content in Author Bus (the repository that powers da.live) while editing the content using Universal Editor.

## Getting started

The best way to get started quickly is to clone the [da-block-collection](https://github.com/aemsites/da-block-collection) site. This site already has all UE instrumentation built in. To get a sense of the effort involved in adding it to your own project, inspect the `ue` folder of the da-block-collection repository.

## **Building the component definition files**

The tree component definition files `component-models.json` , `component-definitions.json` , `component-filters.json` controlling the [UE](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction) instrumentation must be stored in the project root folder. You can either edit these files directly — which is not really recommended, as they can grow quickly if you have more blocks — or use the simple bundling tool that we provide.

Instead of maintaining three massive JSON files with all our component configurations, we keep them organized in separate files per component. We recommend following the [da-block-collection](https://github.com/aemsites/da-block-collection/tree/main/ue) approach and keeping the files organised in the `ue/models` folder. The file structure looks like the following:

```
ue/models/
├── blocks/
│   ├── accordion.json     # Contains definitions, models, and filters for accordion
│   ├── cards.json         # Contains definitions, models, and filters for cards
│   └── ...
├── component-models.json      # Template that references all block models
├── component-definition.json  # Template that references all block definitions
└── component-filters.json     # Template that references all block filters
```

This repo also contains a `build:json` script build pipeline that consolidates Universal Editor from `ue/models` into the final configuration files. Think of it like a bundler, but for JSON configuration instead of JavaScript. You can run `npm run build:json` to regenerate the consolidated files in the repo's root folder. Additionally, the sample repository also uses `husky` to install a pre-commit hook. This is optional, but it helps you to bundle the UE JSON files with every commit.

This approach keeps our codebase organised while ensuring Universal Editor gets the configuration format it expects.

### **When you add a new component:**

1. Create `ue/models/blocks/your-block.json` with the proper structure
2. Add the new block to the `filters` list of `ue/models/blocks/section.json`
3. Run `npm run build:json` to regenerate the consolidated files
4. The new component will automatically be included in all three output files

### How is a block .json file structured?

Lets review <https://github.com/aemsites/da-block-collection/blob/main/ue/models/blocks/accordion.json> for example.

Each file has three main objects:

+---------------------------------------+
| Code                                  |
+---------------------------------------+
| - definitions (json)                  |
| - models (json)                       |
| - filters (json)                      |
+---------------------------------------+
| ```                                   |
| "definitions": [                      |
|     {                                 |
|       "title": "Accordion",           |
|       "id": "accordion",              |
|       "plugins": {                    |
|         "da": {                       |
|           "name": "accordion",        |
|           "rows": 1,                  |
|           "columns": 2                |
|         }                             |
|       }                               |
|     },                                |
|     {                                 |
|       "title": "Accordion Item",      |
|       "id": "accordion-item",         |
|       "plugins": {                    |
|         "da": {                       |
|           "name": "accordion-item",   |
|           "rows": 2,                  |
|           "columns": 0                |
|         }                             |
|       }                               |
|     }                                 |
|   ],                                  |
| ```                                   |
+---------------------------------------+
| ```                                   |
| "models": [                           |
|     {                                 |
|       "id": "accordion-item",         |
|       "fields": [                     |
|         {                             |
|           "component": "richtext",    |
|           "valueType": "string",      |
|           "name": "div:nth-child(1)", |
|           "value": "",                |
|           "label": "Summary",         |
|           "required": true            |
|         },                            |
|         {                             |
|           "component": "richtext",    |
|           "name": "div:nth-child(2)", |
|           "value": "",                |
|           "label": "Text",            |
|           "valueType": "string",      |
|           "required": true            |
|         }                             |
|       ]                               |
|     }                                 |
|   ],                                  |
| ```                                   |
+---------------------------------------+
| ```                                   |
| "filters": [                          |
|     {                                 |
|       "id": "accordion",              |
|       "components": [                 |
|         "accordion-item"              |
|       ]                               |
|     }                                 |
|   ]                                   |
| ```                                   |
+---------------------------------------+

**definitions**

Here we define the block itself, the name under which it will be displayed in UE, and how the table stored in the document will look.

The `da` plugin is used for this. There are two options for specifying the block table:

- name + rows + columns: name defines the block name

  - rows & columns are number values defining how many rows and how many columns a new empty block will have
  - rows & columns are optional, if omitted they will default to 1

- unsafeHTML: can used to define an block including some dummy content or placeholders which are added to the document when the block is added to UE.

These are used exclusively; only one of the two may be defined.

In the case of accordion, two definitions were created: one for the block itself and a second one for the accordion entries, as the block can contain several similar accordion entries.

**models**

The fields for the side panel in the Universal Editor are defined using the field list in `models`. See the UE documentation for more information.

The `name` attribute is particularly important for use with DA. This contains a CSS selector as described above. A detailed step-by-step flow on how to get the correct CSS selectors is documented below.

**filters**

Filters are only required for more complex blocks. They are used to define the relationship between blocks and items for a block. This allows UE users to add further accordion entries for an accordion, for example, using the + button in UE.

Simple blocks do not require a filter and can only define an empty array here.

## **Instrumenting custom blocks**

Additional UE instrumentation might be needed for you custom blocks. It is recommended to do this in a branch of your project. This is how you can easily add them:

1. Add the block for a (test) page. This can be done with the document editor. If the block supports different format or block options it is recommended to add each version.
2. Open the page in Universal Editor The page should full render in UE already.
3. Navigate to the content tree in UE and select the block The overall site structure is automatically detected by UE. This includes all the block. Blocks in your project without UE instrumentation will be shown as " (no definition)".

+-------------+
| Media       |
+-------------+
| ![][image0] |
+-------------+

1. Open developer console and change to the network tab
2. Open the block properties

+-------------+
| Media       |
+-------------+
| ![][image1] |
+-------------+

The properties panel will be empty as the block has no instrumentation yet.

1. Inspect the /details call via the network tab

+-------------+
| Media       |
+-------------+
| ![][image2] |
+-------------+

Inspect the call response via the "preview" tab, it should look similar to:

+-------------+
| Media       |
+-------------+
| ![][image3] |
+-------------+

You we get a detailed list of the parsed block content with CSS selectors. These CSS selectors are needed for the next step to create the component definition and component model of your block.

### Create the block instrumentation

To register a new block for UE, 3 configurations are required for the corresponding JSON files. Details can be found above.

Within you project in the block folder next to the block CSS & JavaScript files create an `.json` file with `/ue/models/blocks`. The JSON file has 3 arrays:

- `definitions`: enables the block for the Universal Editor. The `id` corresponds to block name. Each block has a `da` plugin which defines the initial content structure used by the block when added to the page.
- `models`: defines all the fields of the UE properties panel, including field type, behavior and validation. Fields are linked to the content of the block via one CSS selector of the previous step.
- `filters`: is only used for container blocks (like [Cards](https://github.com/aemsites/da-block-collection/blob/main/ue/models/blocks/cards.json) or [Accordion](https://github.com/aemsites/da-block-collection/blob/main/ue/models/blocks/accordion.json) block), otherwise an empty array.

Finally, the block must be made “known”. This means it must be added to the section filter list in `/ue/models/section.json`.

For examples see the [da-block-collection](https://github.com/aemsites/da-block-collection) and review the UE documentation on the available field types and options.

### Test the block instrumentation

Testing the new block in Universal Editor is easy, the change only must be pushed to a branch.

Once the changes have been pushed to a branch, they can be tested as follows:

1. Open a test page from [da.live](https://da.live/)
2. If UE is configured as default editor it will open in UE. If the page opens in the document editor click the "open in UE" button on the right side of the page content.
3. UE will usually open with you page in WYSIWYG mode on the `main` branch.
4. Change the UE URL to you branch and test Open UE for your DA site and change the URL to the created branch.
5. Navigate to a content section
6. Click `+` on the side navigation bar of UE to add the new block

## **Using block options**

Some blocks may support one or more block options. Instead of authors writing the block class names in the block header, we have a nice way to achieve this with the Universal Editor.

You can either provide your authors with a block options field. This is usually a single or multiple select component, depending on the block options supported by the block. Of course, a simple text field will also work, but this is rather inconvenient for the author. Unlike content components, block options are not defined by a CSS selected as a name in the component models. The fields are simply named `classes`.

You can also configure multiple block options fields to support more complex combinations. These fields must start with `classes_` and will be combined into a class list during rendering.

## **Additional Scripts for UE**

In some situations, it is necessary to execute additional JavaScript code only when the page is loaded using the Universal Editor and while content changes are done by the partitioner.

The most common cases for this are:

- A block of code that modifies the DOM in such a way that the UE instrumentation (data attributes) is lost. For example, if the code replaces a block `div` with an `ul/li`.
- The block needs to react to author actions while loaded inside the editor. For example, an accordion should expand the selected item, or a carousel should jump to the selected item and stop autoscrolling while being edited. A list of UE events can be found [here](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/events).

This can be achieved by loading extra JavaScript code via `ue.js`. **Hint:** see the [ue.js of the block collection](https://github.com/aemsites/da-block-collection/blob/main/ue/scripts/ue.js) with examples for both cases explained above. It covers the boilerplate blocks like carousel, accordion or tabs.

[image0]: https://main--docket--da-pilot.aem.page/media_1757cb855c47831abf18b73c18c4a2730747089a2.png#width=902&height=746

[image1]: https://main--docket--da-pilot.aem.page/media_13303a2f59362be90e49551246f481c50ba1e8b47.png#width=902&height=584

[image2]: https://main--docket--da-pilot.aem.page/media_150a953be98798aa75619daf6110f1e1c55480e0d.png#width=3400&height=864

[image3]: https://main--docket--da-pilot.aem.page/media_1d370e04883ef003af1a6e7b51211d2d42bbfb1fb.png#width=3408&height=1514
