import { inject, observer } from 'mobx-react'
import React from 'react'

import {
  OrangePage,
} from '../classes/index'
import { documentStore } from '../stores'

interface InjectedProps {
  document: typeof documentStore
}
@inject('document')
@observer
class Pages extends React.Component {

  get injected() {
    return this.props as InjectedProps
  }

  private renderPagesList = (list: OrangePage[]): JSX.Element[] => {
    return list.map((page: OrangePage) => (
      <li
        key={page.id}
        className={(this.injected.document.selectedPage === page) ? 'current' : ''}
      >
        {page.name}
      </li>
    ))
  }

  public render() {
    return (
      <ul className='pages'>
        {this.renderPagesList(this.injected.document.pages)}
      </ul>
    )
  }
}

export default Pages
