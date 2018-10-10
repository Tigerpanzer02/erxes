import { Icon, ModalTrigger } from 'modules/common/components';
import { __ } from 'modules/common/utils';
import { borderRadius, colors, grid } from 'modules/deals/constants';
import { AddNew } from 'modules/deals/styles/deal';
import { IDeal, IStage } from 'modules/deals/types';
import { renderDealAmount } from 'modules/deals/utils';
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { DealAddForm } from '.';
import DealList from './DealList';

const Container = styled.div`
  margin: ${grid}px;
`;

const Header = styledTS<{ isDragging: boolean }>(styled.div)`
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.blue.lighter : colors.blue.light};
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${colors.blue.lighter};
  }

  padding: 8px;
`;

const Title = styled('h4')`
  margin: 0;
  font-size: 11px;
  line-height: inherit;
  text-transform: uppercase;
  font-weight: bold;

  span {
    color: ${colors.grey.N30};
    margin-left: 5px;
    font-size: 90%;
  }
`;

type Props = {
  index: number;
  stage: IStage;
  deals: IDeal[];
  addDeal: (name: string, callback: () => void) => void;
};

export default class Stage extends React.Component<Props> {
  renderAddDealTrigger() {
    const { addDeal } = this.props;

    const trigger = (
      <AddNew>
        <Icon icon="add" /> {__('Add a deal')}
      </AddNew>
    );

    return (
      <ModalTrigger
        title="Add a deal"
        trigger={trigger}
        content={props => <DealAddForm {...props} add={addDeal} />}
      />
    );
  }

  render() {
    const { index, stage, deals } = this.props;

    return (
      <Draggable draggableId={stage.name} index={index}>
        {(provided, snapshot) => (
          <Container innerRef={provided.innerRef} {...provided.draggableProps}>
            <Header isDragging={snapshot.isDragging}>
              <Title
                isDragging={snapshot.isDragging}
                {...provided.dragHandleProps}
              >
                {stage.name}
                <span>({deals.length})</span>
              </Title>
              {renderDealAmount(stage.amount)}
            </Header>

            <DealList
              listId={stage._id}
              listType="DEAL"
              stageId={stage._id}
              deals={deals}
            />

            {this.renderAddDealTrigger()}
          </Container>
        )}
      </Draggable>
    );
  }
}
