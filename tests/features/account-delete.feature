Feature: Delete Account
  Cause and Donator users can delete their account.
    
  @delete_account
  Scenario Outline: Guest and admin users cannot delete accounts
    Given Im a <role> user
    And I <logged_in_state> logged in
    And I want to delete my account
    When I submit a valid password to trigger account deletion
    Then I should receive a 403 http status code

    Examples:
      | role      | logged_in_state  |
      | "guest"   | "am not"         |
      | "admin"   | "am"             |

  @delete_account
  Scenario Outline: Cause user attempts to delete account with an invalid password
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to delete my account
    When I submit a <invalid_password> password to trigger account deletion
    Then I should receive a 400 http status code
    And I should receive a password <invalid_notice> notice

    Examples:
      | invalid_password | invalid_notice                                           |
      | "empty"          | "Password should be between 10 and 60 characters long"   |
      | "tooshort"       | "Password should be between 10 and 60 characters long"   |
      | "toolong"        | "Password should be between 10 and 60 characters long"   |

  @delete_account
  Scenario: Cause user attempts to delete account with a valid but incorrect password
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to delete my account
    When I submit a valid but incorrect password to trigger account deletion
    Then I should receive a 401 http status code
    And I should receive a "Password is incorrect" notice

  @delete_account
  Scenario Outline: Cause user with a Cause successfully deletes their account
    Given Im a 'cause' user
    And I 'am' logged in
    And I <have_archived_wallets> 1 previous wallets
    And I want to delete my account
    When I submit a valid password to trigger account deletion
    Then I should receive a 200 http status code
    And I should be redirected to '/'
    And all my personal and charity details should be deleted
    And I want to view the explore page
    And I specify search for 'Altruistic Research Computation And Donation Engine'
    When I submit the explore search
    Then I should receive a 200 http status code
    And there should be 0 causes listed

    Examples:
      | have_archived_wallets |
      | 'do not have'         |
      | 'have'                |
