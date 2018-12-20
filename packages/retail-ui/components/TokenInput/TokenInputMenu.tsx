import * as React from 'react';
import Menu from '../Menu/Menu';
import MenuItem from '../MenuItem';
import MenuSeparator from '../MenuSeparator/MenuSeparator';
import Spinner from '../Spinner';
import Popup from '../Popup/Popup';
import cn from 'classnames';
import styles from './TokenInput.less';

export interface TokenInputMenuProps {
  anchorElement: HTMLElement;
  onAddItem: (item: string) => void;
  inputValue: string;
  autocompleteItems?: string[];
  renderNotFound?: () => React.ReactNode;
  renderItem?: (item: string) => React.ReactNode;
  showAddItemHint?: boolean;
}

export default class TokenInputMenu extends React.Component<
  TokenInputMenuProps
> {
  private menu: Menu | null = null;

  public render() {
    return (
      <Popup
        opened={true}
        positions={['bottom left']}
        anchorElement={this.props.anchorElement}
        popupOffset={8}
      >
        {this.renderMenu()}
      </Popup>
    );
  }

  public getMenuRef = (): Menu | null => this.menu;

  private menuRef = (node: Menu) => (this.menu = node);

  private renderMenu() {
    const {
      autocompleteItems,
      renderNotFound,
      renderItem,
      showAddItemHint
    } = this.props;

    const handleAddItemNoteClick = () =>
      this.props.onAddItem(this.props.inputValue);

    const addItemNote = (
      <MenuItem onClick={handleAddItemNoteClick}>
        {(state: 'hover') => [
          <div key="addValue">Добавить {this.props.inputValue}</div>,
          <div
            key="addValueSubheader"
            className={cn(styles.subheader, {
              [styles.subheaderHovered]: state === 'hover'
            })}
          >
            Нажмите Enter или запятую
          </div>
        ]}
      </MenuItem>
    );
    const addItemNoteWithSeparator = showAddItemHint
      ? [<MenuSeparator key="separator" />, addItemNote]
      : undefined;

    if (autocompleteItems === undefined) {
      return (
        <Menu ref={this.menuRef}>
          <MenuItem disabled>
            <span style={{ margin: '-2px 0 -1px' }}>
              <Spinner type="mini" dimmed />
            </span>
          </MenuItem>
          {addItemNoteWithSeparator}
        </Menu>
      );
    }

    if (autocompleteItems.length === 0 && this.props.inputValue) {
      return (
        <Menu ref={this.menuRef}>
          {showAddItemHint ? (
            addItemNote
          ) : (
            <MenuItem disabled>
              {renderNotFound ? renderNotFound() : 'Не найдено'}
            </MenuItem>
          )}
        </Menu>
      );
    }
    return (
      <Menu ref={this.menuRef}>
        {autocompleteItems.map(item => {
          const handleClick = () => this.props.onAddItem(item);
          return (
            <MenuItem key={undefined} onClick={handleClick}>
              {renderItem ? renderItem(item) : item}
            </MenuItem>
          );
        })}
        {addItemNoteWithSeparator}
      </Menu>
    );
  }
}
