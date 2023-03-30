@operations
Feature: Operations on account
  Scenario Outline: Operate on existent account with positive balance
    Given the existent account 'account123' with positive balance <balanceBeforeOperation> 
    And an existent operation with type <operationType> and cost <operationCost>
    When a request to compute a new operation with type <operationType> is made with values <operationValues>
    Then the operation is processed
    And the new account balance is <balanceAfterOperation>
  Examples:
    | operationType      | operationCost | operationValues  | balanceBeforeOperation | balanceAfterOperation |
    | 'addition'         | 1             | '1,2'            | 1000                   | 999                   |
    | 'subtraction'      | 1             | '3,2,1'          | 1000                   | 999                   |
    | 'multiplication'   | 1             | '1,2,3'          | 1000                   | 999                   |
    | 'division'         | 1             | '20,2,2'         | 1000                   | 999                   |
    | 'squareRoot'       | 1             | '10'             | 1000                   | 999                   |
    | 'randomString'    | 1              | ''               | 1000                   | 999                   |

  Scenario: Request with unexistent operation
    Given the existent account 'account123' with positive balance 1000
    And NO registered operation
    When a request to compute a new operation with type 'unexistentOp' is made with values '1'
    Then the request is rejected with error 'Operation type does not exist'

  Scenario: Operate on an unexistent account
    Given there is NO existent account 'account123'
    And an existent operation with type 'addition' and cost 1
    When a request to compute a new operation with type 'addition' is made with values '1,2'
    Then the request is rejected with error 'Account does not exist'

  Scenario: Operate on existent account with no balance
    Given the existent account 'account123' with positive balance 0 
    And an existent operation with type 'addition' and cost 1
    When a request to compute a new operation with type 'addition' is made with values '1,2'
    Then the request is rejected with error 'Insufficient balance'

  Scenario: Delete existent operation
    Given the existent account 'account123' with positive balance 1000
    And the operation 'op-1' was computed sucessfully
    When a request to delete the operation 'op-1' is made
    Then the operation 'op-1' is deleted sucessfully 

  Scenario: Delete an already deleted operation
    Given the existent account 'account123' with positive balance 1000
    And the operation 'op-1' was computed sucessfully 
    And the operation 'op-1' was removed sucessfully
    When a request to delete the operation 'op-1' is made
    Then the request is rejected with error 'Operation was already deleted'

  Scenario: Delete unexistent operation
    Given the existent account 'account123' with positive balance 1000
    And NO operation was computed sucessfully
    When a request to delete the operation 'op-1' is made
    Then the request is rejected with error 'Operation does not exist'

  Scenario: Random string fails when service is unavailable
    Given the existent account 'account123' with positive balance 1000 
    And an existent operation with type 'randomString' and cost 1
    And the random string service is unavailable
    When a request to compute a new operation with type 'randomString' is made with values ''
    Then the request is rejected with error 'Random string service unavailable'