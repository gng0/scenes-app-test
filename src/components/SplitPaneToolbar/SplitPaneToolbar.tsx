import { ButtonGroup, ToolbarButton } from '@grafana/ui';
import React from 'react';

interface Props {
  onCloseSplitView: () => void;
}

export default function SplitPaneToolbar({ onCloseSplitView }: Props) {
  return (
    <ButtonGroup key="split-controls">
      <ToolbarButton tooltip="Close split pane" onClick={onCloseSplitView} icon="times" variant="canvas">
        Close
      </ToolbarButton>
    </ButtonGroup>
  );
}
