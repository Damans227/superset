/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { t } from '@superset-ui/core';
import ErrorMessageWithStackTrace from 'src/components/ErrorMessage/ErrorMessageWithStackTrace';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: Function;
  showMessage?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static defaultProps = {
    onError: () => {},
    showMessage: true,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (this.props.onError) this.props.onError(error, info);
    this.setState({ error, info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      const firstLine = error.toString();
      const message = (
        <span>
          <strong>{t('Unexpected error')}</strong>
          {firstLine ? `: ${firstLine}` : ''}
        </span>
      );
      if (this.props.showMessage) {
        return (
          <ErrorMessageWithStackTrace
            subtitle={message}
            copyText={message}
            stackTrace={info ? info.componentStack : null}
          />
        );
      }
      return null;
    }
    return this.props.children;
  }
}