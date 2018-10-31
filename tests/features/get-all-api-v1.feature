Feature: Get All API V1
  Client miner applications should be able to retrieve charity details from the
  API. The API should advise clients when to stop mining, and should also
  record client connections for the purpose of generating statistics.

  @get_all_api_v1
  Scenario: Returns 400 if receiving an invalid Cause ID
    Given Im a 'guest' user
    And I 'am not' logged in
    And I have a miner client
    When I send an invalid cause ID to the client api endpoint
    Then I should receive a 400 http status code

  @get_all_api_v1
  Scenario: Returns 404 if the Cause cannot be located from the ID passed in
    Given Im a 'guest' user
    And I 'am not' logged in
    And I have a miner client
    And I have a cause to mine against
    And the cause has since been deleted
    When I send the cause ID to the client api endpoint
    Then I should receive a 404 http status code

  @get_all_api_v1
  Scenario: Returns 422 and no offline notice when the Cause is offline and has not provided a notice
    Given Im a 'guest' user
    And I 'am not' logged in
    And I have a miner client
    And I have a cause to mine against
    And the cause has since toggled offline 'without' an offline notice
    When I send the cause ID to the client api endpoint
    Then I should receive a 422 http status code
    And I should receive an '' offline notice

  @get_all_api_v1
  Scenario: Returns 422 and an offline notice when the Cause is offline and has provided a notice
    Given Im a 'guest' user
    And I 'am not' logged in
    And I have a miner client
    And I have a cause to mine against
    And the cause has since toggled offline 'with' an offline notice
    When I send the cause ID to the client api endpoint
    Then I should receive a 422 http status code
    And I should receive an 'Reasons for being offline here' offline notice

  @get_all_api_v1
  Scenario: Returns 200 and a full set of Cause data when Cause is found and is online
    Given Im a 'guest' user
    And I 'am not' logged in
    And I have a miner client
    And I have a cause to mine against
    When I send the cause ID to the client api endpoint
    Then I should receive a 200 http status code
    And I should receive 'Test Charity Ltd' as the cause 'name'
    And I should receive 'United Kingdom' as the cause 'country'
  