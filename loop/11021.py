a = int(input())
for i in range(a):
    b, c = map(int, input().split(' '))
    print('Case #', i+1, ":", sep='', end=' ')
    print(b+c)
