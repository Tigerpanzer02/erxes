import { Tip } from 'modules/common/components';
import { colors } from 'modules/common/styles';
import * as React from 'react';
import styled from 'styled-components';
import { IUser } from '../../../auth/types';

type Props = {
  users: IUser[];
};

const UserCounterContainer = styled.ul`
  margin-bottom: 0;
  list-style: none;
  padding: 0;

  li {
    float: left;
    border: 2px solid ${colors.colorWhite};
    width: 28px;
    height: 28px;
    line-height: 26px;
    border-radius: 14px;
    background: ${colors.colorCoreLightGray};
    text-align: center;
    color: ${colors.colorWhite};
    overflow: hidden;
    margin-left: -12px;
    font-size: 10px;

    img {
      width: 100%;
      vertical-align: top;
    }
  }
`;

class UserCounter extends React.Component<Props, { show: boolean }> {
  constructor(props) {
    super(props);

    this.state = { show: false };
    this.showOthers = this.showOthers.bind(this);
  }

  showOthers() {
    this.setState({ show: true });
  }

  renderUserItem(item) {
    return (
      <li key={item._id}>
        <Tip text={item.details.fullName || item.email}>
          <img
            alt={item.details.fullName || item.email}
            src={item.details.avatar || '/images/avatar-colored.svg'}
          />
        </Tip>
      </li>
    );
  }

  renderOtherUsers(users) {
    if (this.state.show) {
      return users.map(
        (user, index) => (index > 0 ? this.renderUserItem(user) : null)
      );
    }

    return (
      <li onClick={this.showOthers} className="remained-count">
        +{users.length - 1}
      </li>
    );
  }

  render() {
    const { users } = this.props;
    const length = users.length;

    if (length === 0) return null;

    return (
      <UserCounterContainer>
        {this.renderUserItem(users[0])}
        {length > 1 ? this.renderOtherUsers(users) : null}
      </UserCounterContainer>
    );
  }
}

export default UserCounter;
