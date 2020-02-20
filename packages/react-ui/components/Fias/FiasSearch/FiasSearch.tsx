import React from 'react';
import warning from 'warning';

import { FiasLocale, FiasLocaleHelper } from '../locale';
import { FiasComboBox, FiasComboBoxProps } from '../Form/FiasComboBox';
import { AddressResponse, APIProvider, Fields, SearchOptions } from '../types';
import { locale } from '../../LocaleProvider/decorators';
import { filterProps } from '../../filterProps';

import { Address } from '..';

const COMBOBOX_PASS_PROPS = {
  limit: true,
  align: true,
  searchOnFocus: true,
  drawArrow: true,
  autoFocus: true,
  borderless: true,
  disablePortal: true,
  disabled: true,
  error: true,
  maxLength: true,
  menuAlign: true,
  onBlur: true,
  onFocus: true,
  onInputValueChange: true,
  placeholder: true,
  size: true,
  warning: true,
  width: true,
  maxMenuHeight: true,
  onMouseEnter: true,
  onMouseOver: true,
  onMouseLeave: true,
};

export interface FiasSearchProps extends Pick<FiasComboBoxProps, keyof typeof COMBOBOX_PASS_PROPS> {
  api: APIProvider;
  address?: Address;
  onValueChange?: (address: Address) => void;
}

/**
 * @deprecated Контур-специфичный компонент, будет удален в 3.0.0, перенесен в `@skbkontur/react-ui-addons` смотри [миграцию](https://github.com/skbkontur/retail-ui/blob/master/MIGRATION.md)
 */

@locale('Fias', FiasLocaleHelper)
export class FiasSearch extends React.Component<FiasSearchProps> {
  public static __KONTUR_REACT_UI__ = 'FiasSearch';

  public static defaultProps = {
    width: '100%',
    limit: 5,
    drawArrow: false,
    searchOnFocus: false,
  };

  private readonly locale!: FiasLocale;

  public constructor(props: FiasSearchProps) {
    super(props);
    warning(
      false,
      `FiasSearch has been deprecated, use FiasSearch from @skbkontur/react-ui-addons instead, see [migration](https://github.com/skbkontur/retail-ui/blob/master/MIGRATION.md)`,
    );
  }

  public render() {
    const restComboBoxProps = filterProps(this.props, COMBOBOX_PASS_PROPS);
    return (
      <FiasComboBox
        getItems={this.getItems}
        value={this.props.address}
        renderItem={this.renderItem}
        renderValue={this.renderValue}
        valueToString={this.valueToString}
        onValueChange={this.onValueChange}
        onUnexpectedInput={this.onUnexpectedInput}
        renderNotFound={this.renderNotFound}
        {...restComboBoxProps}
      />
    );
  }

  private renderItem = (address: Address): string => {
    return address.getText();
  };

  private renderValue = (address: Address): string => {
    return address.getText(Fields.room);
  };

  private renderNotFound = (): React.ReactNode => {
    return this.locale.searchNotFound;
  };

  private valueToString = (address: Address): string => {
    return address.getText(Fields.room);
  };

  private onValueChange = (address: Address) => {
    const { onValueChange } = this.props;
    if (onValueChange) {
      onValueChange(address);
    }
  };

  private onUnexpectedInput = (query: string) => {
    if (!query) {
      return new Address();
    }
  };

  private getItems = async (searchText: string) => {
    const { api, limit } = this.props;

    const options: SearchOptions = {
      searchText,
      fullAddress: true,
      directParent: false,
      limit: (limit || FiasSearch.defaultProps.limit) + 1, // +1 to detect if there are more items
    };

    return api.search(options).then(result => {
      const { success, data, error } = result;
      return success && data
        ? Promise.resolve(data.map((item: AddressResponse) => Address.createFromResponse(item)))
        : Promise.reject(error);
    });
  };
}
