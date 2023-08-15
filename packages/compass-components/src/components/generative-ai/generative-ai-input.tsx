import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { spacing } from '@leafygreen-ui/tokens';

import { Button, Icon, IconButton, TextInput } from '../leafygreen';
import { useDarkMode } from '../../hooks/use-theme';
import { ErrorSummary } from '../error-warning-summary';
import { SpinLoader } from '../loader';
import { DEFAULT_ROBOT_SIZE, RobotSVG } from './robot-svg';
import { AIFeedback } from './ai-feedback';
import type { AIFeedbackProps } from './ai-feedback';
import { focusRing } from '../../hooks/use-focus-ring';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
  margin: `0px ${spacing[2]}px`,
  marginTop: '2px',
});

const inputBarContainerStyles = css({
  paddingTop: spacing[2],
  gap: spacing[2],
  flexGrow: 1,
  display: 'flex',
});

const inputContainerStyles = css({
  display: 'flex',
  flexGrow: 1,
  position: 'relative',
});

const textInputStyles = css({
  flexGrow: 1,
});

const errorSummaryContainer = css({
  marginTop: spacing[1],
});

const floatingButtonsContainerStyles = css({
  position: 'absolute',
  right: spacing[1],
  display: 'flex',
  gap: spacing[2],
  alignItems: 'center',
  // Match the whole textbox.
  height: spacing[4] + spacing[1],
});

const successIndicatorDarkModeStyles = css({
  color: palette.gray.dark3,
  backgroundColor: palette.green.base,
  borderRadius: '50%',
});

const successIndicatorLightModeStyles = css({
  color: palette.white,
  backgroundColor: palette.green.dark1,
  borderRadius: '50%',
});

const generateButtonStyles = css({
  border: 'none',
  height: spacing[4] - spacing[1],
  display: 'flex',
  fontSize: '12px',
  borderRadius: spacing[1],
});

const generateButtonLightModeStyles = css({
  backgroundColor: palette.gray.light2,
});

const highlightSize = 14;

const buttonHighlightStyles = css({
  // Custom button styles.
  height: `${highlightSize}px`,
  lineHeight: `${highlightSize}px`,
  padding: `0px ${spacing[1]}px`,
  borderRadius: '2px',
});

const buttonHighlightDarkModeStyles = css({
  backgroundColor: palette.gray.dark1,
  color: palette.gray.light1,
});

const buttonHighlightLightModeStyles = css({
  backgroundColor: palette.gray.light1,
  color: palette.gray.dark1,
});

const loaderContainerStyles = css({
  padding: spacing[1],
  display: 'inline-flex',
  width: DEFAULT_ROBOT_SIZE + spacing[2],
  justifyContent: 'space-around',
});

const buttonResetStyles = css({
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
});

const closeAIButtonStyles = css(
  buttonResetStyles,
  {
    padding: spacing[1],
    display: 'inline-flex',
  },
  focusRing
);

const closeText = 'Close AI Query';

const SubmitArrowSVG = ({ darkMode }: { darkMode?: boolean }) => (
  <svg
    width={highlightSize}
    height={highlightSize}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="14"
      height="14"
      rx="2"
      fill={darkMode ? palette.gray.dark1 : palette.gray.light1}
    />
    <path
      d="M5.24984 6.41668L2.9165 8.75001M2.9165 8.75001L5.24984 11.0833M2.9165 8.75001H9.33317C9.95201 8.75001 10.5455 8.50418 10.9831 8.06659C11.4207 7.62901 11.6665 7.03552 11.6665 6.41668C11.6665 5.79784 11.4207 5.20435 10.9831 4.76676C10.5455 4.32918 9.95201 4.08334 9.33317 4.08334H8.74984"
      stroke={darkMode ? palette.gray.light1 : palette.gray.dark1}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type GenerativeAIInputProps = {
  aiPromptText: string;
  didSucceed: boolean;
  errorMessage?: string;
  isFetching?: boolean;
  show: boolean;
  onCancelRequest: () => void;
  onChangeAIPromptText: (text: string) => void;
  onClose: () => void;
  onSubmitText: (text: string) => void;
} & AIFeedbackProps;

function GenerativeAIInput({
  aiPromptText,
  didSucceed,
  errorMessage,
  isFetching,
  show,
  onCancelRequest,
  onClose,
  onChangeAIPromptText,
  onSubmitFeedback,
  onSubmitText,
}: GenerativeAIInputProps) {
  const promptTextInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const darkMode = useDarkMode();

  const onTextInputKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        onSubmitText(aiPromptText);
      } else if (evt.key === 'Escape') {
        isFetching ? onCancelRequest() : onClose();
      }
    },
    [aiPromptText, onClose, onSubmitText, isFetching, onCancelRequest]
  );

  useEffect(() => {
    if (didSucceed) {
      setShowSuccess(true);

      const timeoutId = setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [didSucceed]);

  useEffect(() => {
    if (show) {
      promptTextInputRef.current?.focus();
    }
  }, [show]);

  const onCancelRequestRef = useRef(onCancelRequest);
  onCancelRequestRef.current = onCancelRequest;

  useEffect(() => {
    // When unmounting, ensure we cancel any ongoing requests.
    return () => onCancelRequestRef.current?.();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className={containerStyles}>
      <div className={inputBarContainerStyles}>
        <div className={inputContainerStyles}>
          <TextInput
            className={textInputStyles}
            ref={promptTextInputRef}
            sizeVariant="small"
            data-testid="ai-query-user-text-input"
            aria-label="Enter a plain text query that the AI will translate into MongoDB query language."
            placeholder="Tell Compass what documents to find (e.g. which movies were released in 2000)"
            value={aiPromptText}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              onChangeAIPromptText(evt.currentTarget.value)
            }
            onKeyDown={onTextInputKeyDown}
          />
          <div className={floatingButtonsContainerStyles}>
            {aiPromptText && (
              <IconButton
                aria-label="Clear query prompt"
                onClick={() => onChangeAIPromptText('')}
                data-testid="ai-text-clear-prompt"
              >
                <Icon glyph="X" />
              </IconButton>
            )}
            <Button
              size="small"
              className={cx(
                generateButtonStyles,
                !darkMode && generateButtonLightModeStyles
              )}
              data-testid="ai-query-generate-button"
              onClick={() =>
                isFetching ? onCancelRequest() : onSubmitText(aiPromptText)
              }
            >
              {isFetching ? (
                <>
                  <div>Cancel</div>
                  <span
                    className={cx(
                      buttonHighlightStyles,
                      darkMode
                        ? buttonHighlightDarkModeStyles
                        : buttonHighlightLightModeStyles
                    )}
                  >
                    esc
                  </span>
                </>
              ) : (
                <>
                  <div>Generate</div>
                  <SubmitArrowSVG darkMode={darkMode} />
                </>
              )}
            </Button>
            {isFetching ? (
              <div className={loaderContainerStyles}>
                <SpinLoader />
              </div>
            ) : showSuccess ? (
              <div className={loaderContainerStyles}>
                <Icon
                  className={
                    darkMode
                      ? successIndicatorDarkModeStyles
                      : successIndicatorLightModeStyles
                  }
                  glyph="CheckmarkWithCircle"
                />
              </div>
            ) : (
              <button
                className={closeAIButtonStyles}
                data-testid="close-ai-query-button"
                aria-label={closeText}
                title={closeText}
                onClick={() => onClose()}
              >
                {isFetching ? <SpinLoader /> : <RobotSVG />}
              </button>
            )}
          </div>
        </div>
        {didSucceed && <AIFeedback onSubmitFeedback={onSubmitFeedback} />}
      </div>
      {errorMessage && (
        <div className={errorSummaryContainer}>
          <ErrorSummary data-testid="ai-query-error-msg" errors={errorMessage}>
            {errorMessage}
          </ErrorSummary>
        </div>
      )}
    </div>
  );
}

export { GenerativeAIInput };