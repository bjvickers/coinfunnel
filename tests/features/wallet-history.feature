Feature: Wallet History
  Cause user should be able to see their previous wallets

  @wallet
  Scenario: Cause user has no previous wallets
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 0 previous wallets
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my current wallet shows the 'Monero' currency
    And my current wallet shows the 'A464kVGx2Tav4aKyXEiF8qUKAphYxQpMRdWEakRLqN72h7s3oUXaUcrtJ15m6ptssG9KHs9fmM7psLgEeZyZSnwB27iyy601' wallet address
    And my current wallet shows the 'System' wallet creator type
    And my current wallet shows '0.000000000000' as the current balance
    And my current wallet shows '0.000000000000' as the mining donations received
    And there are no previous wallets listed in the history section

  @wallet
  Scenario: Cause user has 1 previous wallet
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 1 previous wallets
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my current wallet shows the 'Monero' currency
    And my current wallet shows the 'A464kVGx2Tav4aKyXEiF8qUKAphYxQpMRdWEakRLqN72h7s3oUXaUcrtJ15m6ptssG9KHs9fmM7psLgEeZyZSnwB27iyy602' wallet address
    And my current wallet shows the 'User' wallet creator type
    And my current wallet shows '0.000000000000' as the current balance
    And my current wallet shows '0.000000000000' as the mining donations received
    And my 1 previous wallets are listed in the history section

  @wallet
  Scenario: Cause user has 5 previous wallets
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 5 previous wallets
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my current wallet shows the 'Monero' currency
    And my current wallet shows the 'A464kVGx2Tav4aKyXEiF8qUKAphYxQpMRdWEakRLqN72h7s3oUXaUcrtJ15m6ptssG9KHs9fmM7psLgEeZyZSnwB27iyy606' wallet address
    And my current wallet shows the 'User' wallet creator type
    And my current wallet shows '0.000000000000' as the current balance
    And my current wallet shows '0.000000000000' as the mining donations received
    And my 5 previous wallets are listed in the history section
