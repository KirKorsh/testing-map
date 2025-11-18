import { Style, Stroke, Fill, Circle } from 'ol/style';

export const roadStyle = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 3
  })
});

export const crossroadStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 2
  }),
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.1)'
  })
});

export const semaphoreStyle = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({
      color: 'green'
    }),
    stroke: new Stroke({
      color: 'white',
      width: 2
    })
  })
});