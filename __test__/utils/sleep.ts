/**
 *
 * @param timer 等待时间
 *
 * @description
 * 等待一段时间，模拟睡眠。
 *
 * @example
 * await sleep(1000)
 */
const sleep = (timer: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timer)
  })
}

export default sleep
