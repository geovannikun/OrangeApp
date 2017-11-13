import paper from 'paper';

export default class ViewZoom {
  public project: paper.Project;
  public factor = 1.25;

  private _minZoom: number;
  private _maxZoom: number;
  private mouseNativeStart: paper.Point;
  private viewCenterStart: paper.Point;

  constructor(project: paper.Project) {
    this.project = project;
    const view = this.project.view;
    project.view.element.addEventListener('wheel', (event: WheelEvent) => {
      const mousePosition = new paper.Point(event.offsetX, event.offsetY);
      this.changeZoomCentered(event.deltaY * -1, mousePosition);
    });

    view.on('mousedown', (ev: paper.MouseEvent) => {
      if (ev.event.which === 2) {
        project.view.element.style.cursor = 'move';
      }
      this.viewCenterStart = view.center;
      // Have to use native mouse offset, because ev.delta
      //  changes as the view is scrolled.
      this.mouseNativeStart = new paper.Point(ev.event.offsetX, ev.event.offsetY);
    });

    view.on('mousedrag', (ev: paper.MouseEvent) => {
      if (this.viewCenterStart && ev.event.which === 2) {
        const nativeDelta = new paper.Point(
          ev.event.offsetX - this.mouseNativeStart.x,
          ev.event.offsetY - this.mouseNativeStart.y,
        );
        // Move into view coordinates to subract delta,
        //  then back into project coords.
        view.center = view.viewToProject(
          view.projectToView(this.viewCenterStart)
          .subtract(nativeDelta));
      }
    });
    view.on('mouseup', (ev: paper.MouseEvent) => {
      project.view.element.style.cursor = 'initial';
    });
  }

  get zoom(): number {
    return this.project.view.zoom;
  }

  get zoomRange(): number[] {
    return [this._minZoom, this._maxZoom];
  }

  /**
   * Set zoom level.
   * @returns zoom level that was set, or null if it was not changed
   */
  private setZoomConstrained(zoom: number): number | null {
    if (this._minZoom) {
      zoom = Math.max(zoom, this._minZoom);
    }
    if (this._maxZoom) {
      zoom = Math.min(zoom, this._maxZoom);
    }
    const view = this.project.view;
    if (zoom !== view.zoom) {
      view.zoom = zoom;
      return zoom;
    }
    return null;
  }

  private changeZoomCentered(delta: number, mousePos: paper.Point) {
    if (!delta) {
      return;
    }
    const view = this.project.view;
    const oldZoom = view.zoom;
    const oldCenter = view.center;
    const viewPos = view.viewToProject(mousePos);

    const newZoom = this.setZoomConstrained(delta > 0 ? view.zoom * this.factor : view.zoom / this.factor);

    if (!newZoom) {
      return;
    }

    const zoomScale = oldZoom / newZoom;
    const centerAdjust = viewPos.subtract(oldCenter);
    const offset = viewPos
      .subtract(centerAdjust.multiply(zoomScale))
      .subtract(oldCenter);
    view.center = view.center.add(offset);
  }

  public zoomTo(rect: paper.Rectangle) {
    const view = this.project.view;
    view.center = rect.center;
    view.zoom = Math.min(
      view.viewSize.height / rect.height,
      view.viewSize.width / rect.width,
    );
  }
}
