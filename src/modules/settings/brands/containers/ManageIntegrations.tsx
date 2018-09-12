import gql from 'graphql-tag';
import { ModalTrigger } from 'modules/common/components';
import { Alert } from 'modules/common/utils';
import { ManageIntegrations } from 'modules/settings/integrations/containers/common';
import { integrationsListParams } from 'modules/settings/integrations/containers/utils';
import { queries as integQueries } from 'modules/settings/integrations/graphql';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';
import { IBrand, IIntegration } from '../types';
import { ChooseBrand } from './';

type Props = {
  currentBrand: IBrand,
  queryParams: any,
  saveMutation: (params: { variables: { _id: string; integrationIds: any } }) => any,
};

class ManageIntegrationsContainer extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.save = this.save.bind(this);
  }

  renderConfirm(integration: IIntegration, actionTrigger, icon, handleChange) {
    if (icon === 'add') {
      return null;
    }

    return (
      <ModalTrigger
        key={integration._id}
        title="Choose new brand"
        trigger={actionTrigger}
      >
        <ChooseBrand
          integration={integration}
          onSave={() => handleChange(icon, integration)}
        />
      </ModalTrigger>
    );
  }

  save(integrationIds) {
    const { currentBrand, saveMutation } = this.props;

    saveMutation({
      variables: {
        _id: currentBrand._id,
        integrationIds
      }
    })
      .then(() => {
        Alert.success('Successfully saved');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  }

  render() {
    const { currentBrand } = this.props;

    const updatedProps = {
      ...this.props,
      current: currentBrand,
      save: this.save,
      renderConfirm: this.renderConfirm
    };

    return <ManageIntegrations {...updatedProps} />;
  }
}

export default compose(
  graphql<Props>(
    gql(mutations.brandManageIntegrations), {
    name: 'saveMutation',
    options: ({ queryParams, currentBrand }) => {
      return {
        refetchQueries: [
          {
            query: gql(integQueries.integrations),
            variables: {
              brandId: currentBrand._id,
              ...integrationsListParams(queryParams)
            }
          },
          {
            query: gql(queries.brandDetail),
            variables: { _id: currentBrand._id }
          },
          {
            query: gql(queries.integrationsCount),
            variables: { brandId: currentBrand._id }
          }
        ]
      };
    }
  })
)(ManageIntegrationsContainer);
