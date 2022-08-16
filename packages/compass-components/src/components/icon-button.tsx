/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import { Icon, IconButton } from '../index';

import { spacing } from '@leafygreen-ui/tokens';
import { css, cx } from '@leafygreen-ui/emotion';

const iconContainer = css({
  display: 'block',
  flex: 'none',
  fontSize: 0,
});

const icons = {
  // the expand/collapse CaretRight and add database icons both use normal so
  // they don't follow the surrounding text colour
  normal: css({
    color: 'var(--icon-color)',
  }),
  // item-action-controls usually use hovered, except for the add database one
  // which is normal. This allows them to not override the standard leafygreen
  // colour
  hovered: css({}),
  // collection, database and nav item icons use inherit so they use the same
  // colour as the surrounding test. The sidebar title also uses inherit, then
  // sets a colour on the button.
  inherit: css({
    color: 'inherit',
  }),
} as const;

export type IconMode = keyof typeof icons;

export const SmallIcon: React.FunctionComponent<
  { glyph: string; mode: IconMode } & React.HTMLProps<HTMLSpanElement>
> = ({ glyph, mode, className, ...props }) => {
  return (
    <span className={cx(iconContainer, className)} {...props}>
      <Icon size="small" glyph={glyph} className={icons[mode]}></Icon>
    </span>
  );
};

// Using important here because leafygreen / emotion applies styles in the order
// that doesn't allow our styles override theirs
const iconButtonSmall = css({
  flex: 'none',
  width: `${spacing[4]}px !important`,
  height: `${spacing[4]}px !important`,
});

export const IconButtonSmall = forwardRef<
  HTMLButtonElement,
  {
    glyph: string;
    mode: IconMode;
    label: string;
    title?: string;
    onClick(evt: React.MouseEvent<HTMLButtonElement>): void;
  } & React.HTMLProps<HTMLButtonElement>
>(function IconButtonSmall(
  { glyph, mode, label, onClick, children, title, className, ...rest },
  ref
) {
  return (
    <IconButton
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error leafygreen confuses TS a lot here
      ref={ref}
      className={cx(iconButtonSmall, className)}
      aria-label={label}
      title={title}
      onClick={onClick}
      {...rest}
    >
      <SmallIcon role="presentation" glyph={glyph} mode={mode}></SmallIcon>
      {/* Only here to make leafygreen menus work */}
      {children}
    </IconButton>
  );
});
