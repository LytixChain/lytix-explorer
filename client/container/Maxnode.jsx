
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import { dateFormat } from '../../lib/date';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import sortBy from 'lodash/sortBy';

import HorizontalRule from '../component/HorizontalRule';
import Pagination from '../component/Pagination';
import Table from '../component/Table';
import Select from '../component/Select';

import { PAGINATION_PAGE_SIZE } from '../constants';

class Maxnode extends Component {
  static propTypes = {
    getMAXs: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.debounce = null;
    this.state = {
      cols: [
        { key: 'lastPaidAt', title: 'Last Paid' },
        { key: 'active', title: 'Active' },
        { key: 'addr', title: 'Address' },
        { key: 'txHash', title: 'Collateral TX' },
        { key: 'txOutIdx', title: 'Index' },
        { key: 'ver', title: 'Version' },
        { key: 'status', title: 'Status' },
      ],
      error: null,
      loading: true,
      maxs: [] ,
      pages: 0,
      page: 1,
      size: 10
    };
  };

  componentDidMount() {
    this.getMAXs();
  };

  componentWillUnmount() {
    if (this.debounce) {
      clearTimeout(this.debounce);
      this.debounce = null;
    }
  };

  getMAXs = () => {
    this.setState({ loading: true }, () => {
      if (this.debounce) {
        clearTimeout(this.debounce);
      }

      this.debounce = setTimeout(() => {
        this.props
          .getMAXs({
            limit: this.state.size,
            skip: (this.state.page - 1) * this.state.size
          })
          .then(({ maxs, pages }) => {
            if (this.debounce) {
              this.setState({ maxs, pages, loading: false });
            }
          })
          .catch(error => this.setState({ error, loading: false }));
      }, 800);
    });
  };

  handlePage = page => this.setState({ page }, this.getMAXs);

  handleSize = size => this.setState({ size, page: 1 }, this.getMAXs);

  render() {
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    } else if (this.state.loading) {
      return this.renderLoading();
    }
    const selectOptions = PAGINATION_PAGE_SIZE;

    const select = (
      <Select
        onChange={ value => this.handleSize(value) }
        selectedValue={ this.state.size }
        options={ selectOptions } />
    );

    // Calculate the future so we can use it to
    // sort by lastPaid in descending order.
    const future = moment().add(2, 'years').utc().unix();

    return (
      <div>
        <HorizontalRule
          select={ select }
          title="Maxnodes" />
        <Table
          cols={ this.state.cols }
          data={ sortBy(this.state.maxs.map((maxn) => {
            const lastPaidAt = moment(maxn.lastPaidAt).utc();
            const isEpoch = lastPaidAt.unix() === 0;

            return {
              ...maxn,
              active: moment().subtract(maxn.active, 'seconds').utc().fromNow(),
              addr: (
                <Link to={ `/address/${ maxn.addr }` }>
                  { `${ maxn.addr.substr(0, 20) }...` }
                </Link>
              ),
              lastPaidAt: isEpoch ? 'N/A' : dateFormat(maxn.lastPaidAt),
              txHash: (
                <Link to={ `/tx/${ maxn.txHash }` }>
                  { `${ maxn.txHash.substr(0, 20) }...` }
                </Link>
              )
            };
          }), ['status']) } />
        <Pagination
          current={ this.state.page }
          className="float-right"
          onPage={ this.handlePage }
          total={ this.state.pages } />
        <div className="clearfix" />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getMAXs: query => Actions.getMAXs(query)
});

export default connect(null, mapDispatch)(Maxnode);
