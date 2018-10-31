Feature: Add Wallet
  Cause user should be able to add their cryptocurrency wallet.

  @wallet
  Scenario Outline: Non-logged-in users cannot add a wallet
    Given Im a <role> user
    And I 'am not' logged in
    And I want to add a wallet
    When I submit a valid wallet
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "donator" |
      | "admin"   |
  
  @wallet
  Scenario Outline: Logged-in, non-Cause users cannot add a wallet
    Given Im a <role> user
    And I 'am' logged in
    And I want to add a wallet
    When I submit a valid wallet
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "donator" |
      | "admin"   |

  @wallet @current
  Scenario Outline: Cause user submits an invalid wallet address
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to add a wallet
    When I submit an <invalid_wallet_address> wallet address
    Then I should receive a 400 http status code
    And I should receive a wallet address <invalid_notice> notice

    Examples:
      | invalid_wallet_address | invalid_notice                                                 |
      | "empty"                | "Wallet address should be between 95 and 106 characters long"  |
      | "invalid"              | "Wallet address contains invalid characters"                   |
      | "toolong"              | "Wallet address should be between 95 and 106 characters long"  |

  @wallet
  Scenario: Cause user submits invalid wallet creator type
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to add a wallet
    When I submit an invalid wallet creator type
    Then I should receive a 400 http status code
    And I should receive a wallet creator type 'Wallet creator type is not recognised' notice

  @wallet
  Scenario: Cause user submits invalid wallet currency
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to add a wallet
    When I submit an invalid wallet currency
    Then I should receive a 400 http status code
    And I should receive a wallet currency 'Wallet currency is not recognised' notice

  @wallet
  Scenario: Cause user can successfully add a new wallet
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to add a wallet
    When I submit a valid wallet
    Then I should receive a 200 http status code
    And I should be redirected to "/dashboard/cause/wallet"
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my current wallet shows the 'Monero' currency
    And my current wallet shows the 'A464kVGx2Tav4aKyXEiF8qUKAphYxQpMRdWEakRLqN72h7s3oUXaUcrtJ15m6ptssG9KHs9fmM7psLgEeZyZSnwB27iyy602' wallet address
    And my current wallet shows the 'User' wallet creator type
    And my current wallet shows '0.000000000000' as the current balance
    And my current wallet shows '0.000000000000' as the mining donations received
