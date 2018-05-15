// Type definitions for node-sketch 0.8.1
// Project: https://github.com/oscarotero/node-sketch
// Definitions by: Geovanni Pacheco <https://github.com/geovannimp>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare module 'node-sketch' {
  import JSZip from 'jszip';

  export function read(file:string): Promise<SketchFile>;
  export function create(parent: Node|SketchFile, data: any): Node|Style|SymbolInstance|FileReference;
  
  
  export interface SketchFile {
    repo: JSZip;
    document: Node;
    meta: Node;
    user: Node;
    pages: Sketch.SketchPage[];
    symbolsPage?: Sketch.SketchPage;
    localSymbols: Node[];
    foreignSymbols: Node[];
    sharedStyles: Sketch.SketchSharedStyle[];
    textStyles: Sketch.SketchSharedStyle[];
    colors: Node[];
    gradients: Node[];
    use(plugin: any): SketchFile;
    save(path: string): SketchFile;
  }
  
  export interface Node {
    new (parent: Node|SketchFile, data: any): Node;
    parent?: Node|SketchFile;
    getParent(type: string, condition: ((node: Node) => Node)|string): Node|SketchFile|undefined;
    getSketch(): SketchFile|undefined;
    set(key: string, node: Node|Object|Array<Object>): void;
    push(key: string, node: Node|Object): Node;
    get(type: string, condition: ((node: Node) => Node)|string): Node|undefined;
    getAll(type: string, condition: ((node: Node) => Node)|string, result?:Array<Node>): Array<Node>;
    detach(): Node;
    replaceWith(node: Node): Node;
    clone(parent?: Node): Node;
    toJson(): Object;
  }
  
  export interface FileReference extends Node {
    readonly file?: string;
    export(dir: string): void;
  }
  
  export interface Style extends Node {
    sharedStyle: Sketch.SketchSharedStyle;
    applySharedStyle(sharedStyle: Sketch.SketchSharedStyle): Style;
  }
  
  export interface SymbolInstance extends Node {
    symbolMaster: Node;
  }

}

declare namespace Sketch {

  type UUID = string // with UUID v4 format

  type SketchPositionString = string // '{0.5, 0.67135115527602085}'
  
  type SketchNestedPositionString = string // '{{0, 0}, {75.5, 15}}'
  
  type Base64String = string
  
  type FilePathString = string
  
  type SketchImageCollection = {
    _class: 'imageCollection',
    images: any // TODO
  }
  
  type SketchColor = {
    _class: 'color',
    alpha: number,
    blue: number,
    green: number,
    red: number
  }
  
  type SketchBorder = {
    _class: 'border',
    isEnabled:  boolean,
    color: SketchColor,
    fillType: number,
    position: number,
    thickness: number
  }
  
  type SketchGradientStop = {
    _class: 'gradientStop',
    color: SketchColor,
    position: number
  }
  
  type SketchGradient = {
    _class: 'gradient',
    elipseLength: number,
    from: SketchPositionString,
    gradientType: number,
    shouldSmoothenOpacity:  boolean,
    stops: [SketchGradientStop],
    to: SketchPositionString
  }
  
  type SketchGraphicsContextSettings = {
    _class: 'graphicsContextSettings',
    blendMode: number,
    opacity: number
  }
  
  type SketchInnerShadow = {
    _class: 'innerShadow',
    isEnabled:  boolean,
    blurRadius: number,
    color: SketchColor,
    contextSettings: SketchGraphicsContextSettings,
    offsetX: 0,
    offsetY: 1,
    spread: 0
  }
  
  type SketchFill = {
    _class: 'fill',
    isEnabled:  boolean,
    color: SketchColor,
    fillType: number,
    gradient: SketchGradient,
    noiseIndex: number,
    noiseIntensity: number,
    patternFillType: number,
    patternTileScale: number
  }
  
  type SketchShadow = {
    _class: 'shadow',
    isEnabled:  boolean,
    blurRadius: number,
    color: SketchColor,
    contextSettings: SketchGraphicsContextSettings,
    offsetX: number,
    offsetY: number,
    spread: number
  }
  
  type SketchBlur = {
    _class: 'blur',
    isEnabled:  boolean,
    center: SketchPositionString,
    motionAngle: number,
    radius: number,
    type: number
  }
  
  type SketchEncodedAttributes = {
    NSKern: number,
    MSAttributedStringFontAttribute: {
      _archive: Base64String,
    },
    NSParagraphStyle: {
      _archive: Base64String
    },
    NSColor: {
      _archive: Base64String
    }
  }
  
  type SketchRect = {
    _class: 'rect',
    constrainProportions:  boolean,
    height: number,
    width: number,
    x: number,
    y: number
  }
  
  type SketchTextStyle = {
    _class: 'textStyle',
    encodedAttributes: SketchEncodedAttributes
  }
  
  type SketchBorderOptions = {
    _class: 'borderOptions',
    do_objectID: UUID,
    isEnabled:  boolean,
    dashPattern: [any], // TODO,
    lineCapStyle: number,
    lineJoinStyle: number
  }
  
  type SketchColorControls = {
    _class: 'colorControls',
    isEnabled:  boolean,
    brightness: number,
    contrast: number,
    hue: number,
    saturation: number
  }
  
  type SketchStyle = {
    _class: 'style',
    blur?: [SketchBlur],
    borders?: [SketchBorder],
    borderOptions?: SketchBorderOptions,
    contextSettings?: SketchGraphicsContextSettings,
    colorControls?: SketchColorControls,
    endDecorationType: number,
    fills: [SketchFill],
    innerShadows: [SketchInnerShadow],
    miterLimit: number,
    shadows?: [SketchShadow],
    sharedObjectID: UUID,
    startDecorationType: number,
    textStyle?: SketchTextStyle
  }
  
  type SketchSharedStyle = {
    _class: 'sharedStyle',
    do_objectID: UUID,
    name: string,
    value: SketchStyle
  }
  
  type SketchExportFormat = {
    _class: 'exportFormat',
    absoluteSize: number,
    fileFormat: string,
    name: string,
    namingScheme: number,
    scale: number,
    visibleScaleType: number
  }
  
  type SketchExportOptions = {
    _class: 'exportOptions',
    exportFormats: [SketchExportFormat],
    includedLayerIds: [any], // TODO
    layerOptions: number,
    shouldTrim:  boolean
  }
  
  type SketchSharedStyleContainer = {
    _class: 'sharedStyleContainer',
    objects: [SketchSharedStyle]
  }
  
  type SketchSymbolContainer = {
    _class: 'symbolContainer',
    objects: [any] // TODO
  }
  
  type SketchSharedTextStyleContainer = {
    _class: 'sharedTextStyleContainer',
    objects: [SketchSharedStyle]
  }
  
  type SketchAssetsCollection = {
    _class: 'assetCollection',
    colors: [any], // TODO
    gradients: [any], // TODO
    imageCollection: SketchImageCollection,
    images: [any] // TODO
  }
  
  type SketchMSJSONFileReference = {
    _class: 'MSJSONFileReference',
    _ref_class: 'MSImmutablePage' | 'MSImageData',
    _red: FilePathString
  }
  
  type SketchMSAttributedString = {
    _class: 'MSAttributedString',
    archivedAttributedString: {
      _archive: Base64String
    }
  }
  
  type SketchCurvePoint = {
    _class: 'curvePoint',
    do_objectID: UUID,
    cornerRadius: number,
    curveFrom: SketchPositionString,
    curveMode: number,
    curveTo: SketchPositionString,
    hasCurveFrom:  boolean,
    hasCurveTo:  boolean,
    point: SketchPositionString
  }
  
  type SketchRulerData = {
    _class: 'rulerData',
    base: number,
    guides: [any] // TODO
  }
  
  type SketchText = {
    _class: 'text',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedVertical:  boolean,
    isFlippedHorizontal:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    originalObjectID: UUID,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    attributedString: SketchMSAttributedString,
    automaticallyDrawOnUnderlyingPath:  boolean,
    dontSynchroniseWithSymbol:  boolean,
    glyphBounds: SketchNestedPositionString,
    heightIsClipped:  boolean,
    lineSpacingBehaviour: number,
    textBehaviour: number
  }
  
  type SketchShapeGroup = {
    _class: 'shapeGroup',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedVertical:  boolean,
    isFlippedHorizontal:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    originalObjectID: UUID,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    hasClickThrough:  boolean,
    layers: [SketchLayer],
    clippingMaskMode: number,
    hasClippingMask:  boolean,
    windingRule: number
  }
  
  type SketchPath = {
    _class: 'path',
    isClosed:  boolean,
    points: [SketchCurvePoint]
  }
  
  type SketchShapePath = {
    _class: 'shapePath',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedVertical:  boolean,
    isFlippedHorizontal:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    booleanOperation: number,
    edited:  boolean,
    path: SketchPath
  }
  
  type SketchArtboard = {
    _class: 'artboard',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    hasClickThrough:  boolean,
    layers: [SketchLayer],
    backgroundColor: SketchColor,
    hasBackgroundColor:  boolean,
    horizontalRulerData: SketchRulerData,
    includeBackgroundColorInExport:  boolean,
    includeInCloudUpload:  boolean,
    verticalRulerData: SketchRulerData
  }
  
  type SketchBitmap = {
    _class: 'bitmap',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    clippingMask: SketchNestedPositionString,
    fillReplacesImage:  boolean,
    image: SketchMSJSONFileReference,
    nineSliceCenterRect: SketchNestedPositionString,
    nineSliceScale: SketchPositionString
  }
  
  type SketchSymbolInstance = {
    _class: 'symbolInstance',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    horizontalSpacing: number,
    masterInfluenceEdgeMaxXPadding: number,
    masterInfluenceEdgeMaxYPadding: number,
    masterInfluenceEdgeMinXPadding: number,
    masterInfluenceEdgeMinYPadding: number,
    symbolID: number,
    verticalSpacing: number,
    overrides: {
      "0": {} // TODO
    }
  }
  
  type SketchGroup = {
    _class: 'group',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    originalObjectID: UUID,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    hasClickThrough:  boolean,
    layers: [SketchLayer]
  }
  
  type SketchRectangle = {
    _class: 'rectangle',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    booleanOperation: number,
    edited:  boolean,
    path: SketchPath,
    fixedRadius: number,
    hasConvertedToNewRoundCorners:  boolean
  }
  
  type SketchOval = {
    _class: 'oval',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    booleanOperation: number,
    edited:  boolean,
    path: SketchPath  
  }
  
  type SketchLayer =
    | SketchText
    | SketchShapeGroup
    | SketchShapePath
    | SketchBitmap
    | SketchSymbolInstance
    | SketchGroup
    | SketchRectangle
    | SketchOval
  
  type SketchSymbolMaster = {
    backgroundColor: SketchColor,
    _class: 'symbolMaster',
    do_objectID: UUID,
    exportOptions: [SketchExportOptions],
    frame: SketchRect,
    hasBackgroundColor:  boolean,
    hasClickThrough:  boolean,
    horizontalRulerData: SketchRulerData,
    includeBackgroundColorInExport:  boolean,
    includeBackgroundColorInInstance:  boolean,
    includeInCloudUpload:  boolean,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    layers: [SketchLayer],
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    symbolID: UUID,
    verticalRulerData: SketchRulerData
  }
  
  // document.json
  type SketchDocument = {
    _class: 'document',
    do_objectID: UUID,
    assets: SketchAssetsCollection,
    currentPageIndex: number,
    enableLayerInteraction:  boolean,
    enableSliceInteraction:  boolean,
    foreignSymbols: [any], // TODO
    layerStyles: SketchSharedStyleContainer,
    layerSymbols: SketchSymbolContainer,
    layerTextStyles: SketchSharedTextStyleContainer,
    pages: [SketchMSJSONFileReference]
  }
  
  // pages/*.json
  type SketchPage = {
    _class: 'page',
    do_objectID: UUID,
    exportOptions: SketchExportOptions,
    frame: SketchRect,
    hasClickThrough:  boolean,
    horizontalRulerData: SketchRulerData,
    includeInCloudUpload:  boolean,
    isFlippedHorizontal:  boolean,
    isFlippedVertical:  boolean,
    isLocked:  boolean,
    isVisible:  boolean,
    layerListExpandedType: number,
    layers: [SketchArtboard | SketchLayer | SketchSymbolMaster],
    name: string,
    nameIsFixed:  boolean,
    resizingType: number,
    rotation: number,
    shouldBreakMaskChain:  boolean,
    style: SketchStyle,
    verticalRulerData: SketchRulerData
  }
  
  // meta.json
  type SketchMeta = {
    commit: string,
    appVersion: string,
    build: number,
    app: string,
    pagesAndArtboards: {
      [key: string]: { name: string }
    },
    fonts: [string], // Font names
    version: number,
    saveHistory: [ string ], // 'BETA.38916'
    autosaved: number,
    variant: string // 'BETA'
  }
  
  type SketchDocumentId = UUID
  
  type SketchPageId = UUID
  
  // user.json
  type SketchUser = {
    [key: string]: {
      scrollOrigin?: SketchPositionString,
      zoomValue?: Number,
      pageListHeight?: number,
      cloudShare?: any // TODO
    }
  }

}