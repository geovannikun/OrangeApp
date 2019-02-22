import ns from 'node-sketch'

class RenderUtils {
  public static async parseSketchFile(file: string) {
    const sketch = await ns.read(file)
    return sketch
  }
}

export default RenderUtils
