const Counter = artifacts.require('Counter')

contract('Counter', async (accounts) => {
    let counterInstance
    it('should increase 1 to counter', async () => {
      let counterInstance = await Counter.deployed()
      await counterInstance.count()
      let count = await counterInstance.counter()
      assert.equal(count, 1)
    })
  }
)