#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Running Development Platform Tests${NC}"
echo "========================================"

# Function to print section headers
print_section() {
    echo -e "\n${YELLOW}$1${NC}"
    echo "----------------------------------------"
}

# Function to check if command succeeded
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 passed${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Clean previous test results
print_section "🧹 Cleaning previous test results"
./mvnw clean
check_result "Clean"

# Run unit tests only
print_section "🔬 Running Unit Tests"
./mvnw test -Dtest="**/*Test" -DfailIfNoTests=false
check_result "Unit Tests"

# Run integration tests only
print_section "🔗 Running Integration Tests"
./mvnw test -Dtest="**/*IntegrationTest" -DfailIfNoTests=false
check_result "Integration Tests"

# Run all tests with coverage
print_section "📊 Running All Tests with Coverage"
./mvnw test jacoco:report
check_result "All Tests with Coverage"

# Generate test report
print_section "📋 Generating Test Reports"
./mvnw surefire-report:report
check_result "Test Report Generation"

# Display test results summary
print_section "📈 Test Results Summary"
if [ -f "target/surefire-reports/TEST-*.xml" ]; then
    echo "Test reports generated in: target/surefire-reports/"
    
    # Count test results
    TOTAL_TESTS=$(grep -h "tests=" target/surefire-reports/TEST-*.xml | sed 's/.*tests="\([0-9]*\)".*/\1/' | awk '{sum += $1} END {print sum}')
    FAILED_TESTS=$(grep -h "failures=" target/surefire-reports/TEST-*.xml | sed 's/.*failures="\([0-9]*\)".*/\1/' | awk '{sum += $1} END {print sum}')
    ERROR_TESTS=$(grep -h "errors=" target/surefire-reports/TEST-*.xml | sed 's/.*errors="\([0-9]*\)".*/\1/' | awk '{sum += $1} END {print sum}')
    SKIPPED_TESTS=$(grep -h "skipped=" target/surefire-reports/TEST-*.xml | sed 's/.*skipped="\([0-9]*\)".*/\1/' | awk '{sum += $1} END {print sum}')
    
    PASSED_TESTS=$((TOTAL_TESTS - FAILED_TESTS - ERROR_TESTS - SKIPPED_TESTS))
    
    echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
    echo -e "Errors: ${RED}$ERROR_TESTS${NC}"
    echo -e "Skipped: ${YELLOW}$SKIPPED_TESTS${NC}"
    
    if [ "$FAILED_TESTS" -eq 0 ] && [ "$ERROR_TESTS" -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All tests passed successfully!${NC}"
    else
        echo -e "\n${RED}❌ Some tests failed. Check the reports for details.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ No test reports found${NC}"
fi

# Display coverage information if available
if [ -f "target/site/jacoco/index.html" ]; then
    print_section "📊 Code Coverage Report"
    echo "Coverage report generated: target/site/jacoco/index.html"
    echo "Open this file in a browser to view detailed coverage information."
fi

# Display useful commands
print_section "🔧 Useful Commands"
echo "Run only unit tests:        ./mvnw test -Dtest=\"**/*Test\""
echo "Run only integration tests: ./mvnw test -Dtest=\"**/*IntegrationTest\""
echo "Run specific test class:    ./mvnw test -Dtest=\"UserServiceImplTest\""
echo "Run with coverage:          ./mvnw test jacoco:report"
echo "Skip tests:                 ./mvnw install -DskipTests"

echo -e "\n${BLUE}🏁 Test execution completed!${NC}" 