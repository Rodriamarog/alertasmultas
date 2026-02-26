/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3472304860")

  // update collection data
  unmarshal({
    "deleteRule": "vehicle.user = @request.auth.id",
    "listRule": "vehicle.user = @request.auth.id",
    "viewRule": "vehicle.user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3472304860")

  // update collection data
  unmarshal({
    "deleteRule": null,
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
