import Konva from 'konva'

export default abstract class OrangeTool {
  public abstract title: string
  public abstract icon: string

  public abstract onSelectAreaCreated: (shape: Konva.ShapeConfig) => void
  public abstract onSelectAreaChange: (shape: Konva.ShapeConfig) => void
  public abstract onSelectAreaDestroyed: (shape: Konva.ShapeConfig) => void
}
