import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const { select, dispatch } = d3;

export function button() {
  const eventDispatch = dispatch('press', 'release');

  const padding = 10,
        radius = 10,
        stdDeviation = 5,
        offsetX = 2,
        offsetY = 4;

  function my(selection) {
    selection.each(function(d, i) {
      const g = select(this)
          .attr('id', 'd3-button' + i)
          .attr('transform', 'translate(' + d.x + ',' + d.y + ')');

      const text = g.append('text').text(d.label);
      const defs = g.append('defs');
      const bbox = text.node().getBBox();
      const rect = g.insert('rect', 'text')
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding)
          .attr("width", bbox.width + 2 * padding)
          .attr("height", bbox.height + 2 * padding)
          .attr('rx', radius)
          .attr('ry', radius)
          .on('mouseover', activate)
          .on('mouseout', deactivate)
          .on('click', toggle)

       addShadow.call(g.node(), d, i);
       addGradient.call(g.node(), d, i);
    });
  }

  function addGradient(d, i) {
    const defs = select(this).select('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'gradient' + i)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    gradient.append('stop')
        .attr('id', 'gradient-start')
        .attr('offset', '0%')

    gradient.append('stop')
        .attr('id', 'gradient-stop')
        .attr('offset', '100%')

    select(this).select('rect').attr('fill', 'url(#gradient' + i + ")" );
  }

  function addShadow(d, i) {
    const defs = select(this).select('defs');
    const rect = select(this).select('rect').attr('filter', 'url(#dropShadow' + i + ")" );
    const shadow = defs.append('filter')
        .attr('id', 'dropShadow' + i)
        .attr('x', rect.attr('x'))
        .attr('y', rect.attr('y'))
        .attr('width', rect.attr('width') + offsetX)
        .attr('height', rect.attr('height') + offsetY)

    shadow.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 2)

    shadow.append('feOffset')
        .attr('dx', offsetX)
        .attr('dy', offsetY);

    const merge = shadow.append('feMerge');

    merge.append('feMergeNode');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  function activate() {
    const gradient = select(this.parentNode).select('linearGradient')
    select(this.parentNode).select("rect").classed('active', true)
    if (!gradient.node()) return;
    gradient.select('#gradient-start').classed('active', true)
    gradient.select('#gradient-stop').classed('active', true)
  }

  function deactivate() {
    const gradient = select(this.parentNode).select('linearGradient')
    select(this.parentNode).select("rect").classed('active', false)
    if (!gradient.node()) return;
    gradient.select('#gradient-start').classed('active', false);
    gradient.select('#gradient-stop').classed('active', false);
  }

  function toggle(d, i) {
    if (select(this).classed('pressed')) {
        release.call(this, d, i);
        deactivate.call(this, d, i);
    } else {
        press.call(this, d, i);
        activate.call(this, d, i);
    }
  }

  function press(d, i) {
    eventDispatch.call('press', this, d, i)
    select(this).classed('pressed', true);
    const shadow = select(this.parentNode).select('filter')
    if (!shadow.node()) return;
    shadow.select('feOffset').attr('dx', 0).attr('dy', 0);
    shadow.select('feGaussianBlur').attr('stdDeviation', 0);
  }

  function release(d, i) {
    eventDispatch.call('release', this, d, i)
    my.clear.call(this, d, i);
  }

  my.clear = function(d, i) {
    select(this).classed('pressed', false);
    const shadow = select(this.parentNode).select('filter')
    if (!shadow.node()) return;
    shadow.select('feOffset').attr('dx', offsetX).attr('dy', offsetY);
    shadow.select('feGaussianBlur').attr('stdDeviation', stdDeviation);
  }

  my.on = function() {
    const value = eventDispatch.on.apply(eventDispatch, arguments);
    return value === eventDispatch ? my : value;
  };

  return my;
}
