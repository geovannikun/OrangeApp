
import paper, { Tool } from 'paper';

export default class ProtoTool {
  public title: string;
  public icon: string;
  public tool: Tool;
  constructor(title: string, icon: string, tool: Tool) {
    this.title = title;
    this.icon = icon;
    this.tool = tool;
  }
}
