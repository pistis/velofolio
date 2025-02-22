import React from 'react'
import { css } from '@emotion/react'

import palette from '../../lib/palette'

import { useLabSettingView } from '../../atoms/labSettingViewState'
import LabSettingsDefault from './LabSettingsDefault'
import LabSettingsPortfolio from './LabSettingsPortfolio'
import media from '../../lib/styles/media'

export type LabSettingsProps = {}

function LabSettings({}: LabSettingsProps) {
  const { mode } = useLabSettingView()

  return (
    <div css={blockStyle}>
      {mode === 'default' && <LabSettingsDefault />}
      {mode === 'portfolio' && <LabSettingsPortfolio />}
    </div>
  )
}

const blockStyle = css`
  position: fixed;
  background: ${palette.grey[100]};
  border-radius: 2rem;
  width: 22.5rem;
  height: calc(100% - 6rem);
  padding: 2rem;
  ${media.medium} {
    position: relative;
    width: 100%;
  }
`

export default LabSettings
