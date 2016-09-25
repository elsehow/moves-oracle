# model-controller

description

## example

```javascript
modelcontroller(modelStreamF)
```

## notes

Takes a method `modelStreamF`, which returns a stream of models. Models should have the format

```javascript
{
  corpus: [...],
  nextF: function ([ngram]) { ... }
}
```

Data model has the format

```javascript
{
  error: null or error or string,
  corpus: [...],
  predictions: [...],
  predictons: [ {}, ... ],
}
```
