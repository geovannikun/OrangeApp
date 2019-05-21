import { inject, observer } from 'mobx-react'
import React from 'react'

import {
  IOrangeItem, OrangeLayer,
} from '../classes/index'
import { documentStore, selectorStore } from '../stores'
import Pages from './Pages'

interface DocumentThreeProps {
  onSelect: (tool: IOrangeItem) => (e?: React.MouseEvent<HTMLElement>) => void
}

interface InjectedProps {
  document: typeof documentStore
  selector: typeof selectorStore
}

@inject('document', 'selector')
@observer
class DocumentThree extends React.Component<DocumentThreeProps> {

  get injected() {
    return this.props as any as InjectedProps
  }

  private handleChangeItem = (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => {
    this.props.onSelect(item)(e)
  }

  private renderSubList = (list: IOrangeItem[], selecteds: IOrangeItem[]): JSX.Element => {
    return(
      <ul>
        {this.renderObjectList(list, selecteds)}
      </ul>
    )
  }

  private renderObjectList = (list: IOrangeItem[], selecteds: IOrangeItem[]): JSX.Element[] => {
    return list.map((item: IOrangeItem) => (
      <li
        key={item.id}
        onClick={this.handleChangeItem(item)}
        className={selecteds.find((selected) => selected === item) ? 'selected' : ''}
      >
        {item.name}
        {item instanceof OrangeLayer && this.renderSubList(item.children, selecteds)}
      </li>
    ))
  }

  public render() {
    const {selector: {selecteds}, document: {selectedPage}} = this.injected

    return (
      <aside className='content'>
        <Pages/>
        <ul className='layer-three'>
          {selectedPage && this.renderObjectList(selectedPage.children, selecteds)}
        </ul>
      </aside>
    )
  }
}

export default DocumentThree
