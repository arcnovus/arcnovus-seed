
xml2js = require "xml2js"
_ = require "lodash"

makeFriendlier = (config) ->
  {
    features: pickFeatures config
  }

pickFeatures = (config) ->
  valuesByName config.feature, (feature) ->
    valuesByName feature.param, (param) ->
      param.$.value

valuesByName = (elements, value) ->
  _(elements || [])
    .chain()
    .filter((element) -> element.$?.name?)
    .indexBy((element) -> element.$.name)
    .mapValues((element) -> value element)
    .value()

module.exports = 
  fromXml: (xmlString, done) ->
    xml2js.parseString(
      xmlString
      { explicitRoot: false }
      (err, rawXmlConfig) ->
        return done err if err?

        friendlyConfig = makeFriendlier rawXmlConfig

        result = JSON.stringify(friendlyConfig, null, 2)
        done null, result
    )
